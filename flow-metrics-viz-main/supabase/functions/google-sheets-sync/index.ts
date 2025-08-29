import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_SHEETS_API_KEY = Deno.env.get('GOOGLE_SHEETS_API_KEY');
const SPREADSHEET_ID = '10Ea4SGrZCscZ95OztNP03IYj4c-OcFwdishRk7y3lYw';
const RANGE = 'Sheet1!A:G'; // Assumindo colunas A-G para os dados

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GOOGLE_SHEETS_API_KEY) {
      throw new Error('Google Sheets API key not configured');
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;
    
    console.log('Fetching data from Google Sheets:', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', errorText);
      throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      console.log('No data found in spreadsheet');
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Primeira linha são os cabeçalhos
    const headers = data.values[0];
    const rows = data.values.slice(1);

    // Mapear os dados para o formato esperado pelo dashboard
    const formattedData = rows
      .filter((row: any[]) => row.length >= 6) // Garantir que temos dados suficientes
      .map((row: any[]) => ({
        data: row[0] || '', // Data
        atendimento_id: row[1] || '', // ID do Atendimento
        tipo_atendimento: row[2] || '', // Tipo de Atendimento
        reuniao_agendada: row[3] === 'TRUE' || row[3] === 'true' || row[3] === '1', // Reunião Agendada
        status_atendimento: row[4] || '', // Status do Atendimento
        estado: row[5] || '', // Estado
        ddd: row[6] || '' // DDD
      }));

    console.log(`Successfully processed ${formattedData.length} records from Google Sheets`);

    return new Response(JSON.stringify(formattedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in google-sheets-sync function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to sync with Google Sheets'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});