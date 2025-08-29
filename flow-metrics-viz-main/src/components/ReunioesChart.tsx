import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AtendimentoData, getReunioesAgendadasPorDia } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReunioesChartProps {
  data: AtendimentoData[];
}

export const ReunioesChart: React.FC<ReunioesChartProps> = ({ data }) => {
  const chartData = getReunioesAgendadasPorDia(data);

  const formattedData = chartData.map(item => ({
    ...item,
    dateFormatted: format(new Date(item.date), 'dd/MM', { locale: ptBR })
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-neon-cyan/20 rounded-lg p-3 shadow-cyan">
          <p className="text-foreground font-medium">
            {format(new Date(payload[0].payload.date), 'dd MMM yyyy', { locale: ptBR })}
          </p>
          <p className="text-neon-cyan">
            Reuniões: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card border border-neon-cyan/20 shadow-cyan">
      <CardHeader>
        <CardTitle className="text-neon-cyan flex items-center gap-2">
          📈 Reuniões Agendadas por Dia
        </CardTitle>
        <CardDescription>
          Tendência de agendamentos de reuniões ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="neonCyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--neon-cyan))" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(var(--neon-cyan))" stopOpacity={0.1} />
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
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--neon-cyan))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--neon-cyan))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--neon-cyan))', fill: 'hsl(var(--card))' }}
                className="drop-shadow-[0_0_8px_hsl(var(--neon-cyan))]"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 bg-neon-cyan/5 rounded-lg border border-neon-cyan/20">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tendência:</strong> {formattedData.length > 1 ? 
              `Taxa de conversão média de ${((chartData.reduce((sum, item) => sum + item.count, 0) / data.length) * 100).toFixed(1)}% de atendimentos para reuniões` :
              'Dados insuficientes para análise de tendência'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};