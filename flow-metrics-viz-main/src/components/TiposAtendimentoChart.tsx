import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AtendimentoData, getTiposAtendimento } from '@/data/mockData';

interface TiposAtendimentoChartProps {
  data: AtendimentoData[];
}

const COLORS = [
  'hsl(var(--neon-green))',
  'hsl(var(--neon-cyan))', 
  'hsl(var(--neon-purple))',
  'hsl(var(--neon-pink))',
  'hsl(var(--neon-orange))'
];

export const TiposAtendimentoChart: React.FC<TiposAtendimentoChartProps> = ({ data }) => {
  const chartData = getTiposAtendimento(data);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-neon-green/20 rounded-lg p-3 shadow-neon">
          <p className="text-foreground font-medium">{payload[0].payload.tipo}</p>
          <p className="text-neon-green">
            Quantidade: <span className="font-bold">{payload[0].value}</span>
          </p>
          <p className="text-muted-foreground text-sm">
            {((payload[0].value / data.length) * 100).toFixed(1)}% do total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Hide labels for slices < 5%
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
        className="drop-shadow-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
            nameKey="tipo"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{ color: 'hsl(var(--foreground))' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};