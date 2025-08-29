import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AtendimentoData } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

export const useGoogleSheetsData = () => {
  const [data, setData] = useState<AtendimentoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error: supabaseError } = await supabase.functions.invoke('google-sheets-sync');

      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(supabaseError.message || 'Erro ao conectar com Google Sheets');
      }

      if (result && Array.isArray(result)) {
        setData(result);
        toast({
          title: "Dados sincronizados",
          description: `${result.length} registros carregados do Google Sheets`,
        });
      } else {
        throw new Error('Formato de dados inválido recebido do Google Sheets');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Error fetching Google Sheets data:', err);
      
      toast({
        title: "Erro na sincronização",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refreshData
  };
};