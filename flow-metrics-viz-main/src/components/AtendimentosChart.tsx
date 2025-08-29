import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AtendimentoData, getAtendimentosPorDia } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AtendimentosChartProps {
  data: AtendimentoData[];
}

export const AtendimentosChart: React.FC<AtendimentosChartProps> = ({ data }) => {
  const chartData = getAtendimentosPorDia(data);

  const formattedData = chartData.map(item => ({
    ...item,
    dateFormatted: format(new Date(item.date), 'dd/MM', { locale: ptBR })
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-neon-green/20 rounded-lg p-3 shadow-neon">
          <p className="text-foreground font-medium">
            {format(new Date(payload[0].payload.date), 'dd MMM yyyy', { locale: ptBR })}
          </p>
          <p className="text-neon-green">
            Atendimentos: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card border border-neon-green/20 shadow-neon">
      <CardHeader>
        <CardTitle className="text-neon-green flex items-center gap-2">
          📊 Atendimentos por Dia
        </CardTitle>
        <CardDescription>
          Evolução diária do volume de atendimentos no período selecionado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="neonGreenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--neon-green))" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(var(--neon-green))" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="dateFormatted" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#neonGreenGradient)"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 bg-neon-green/5 rounded-lg border border-neon-green/20">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Insight:</strong> {formattedData.length > 0 ? 
              `Pico de ${Math.max(...formattedData.map(d => d.count))} atendimentos no dia ${formattedData.find(d => d.count === Math.max(...formattedData.map(item => item.count)))?.dateFormatted}` :
              'Sem dados para o período selecionado'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};