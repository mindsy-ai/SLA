import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AtendimentoData, getDistribuicaoPorEstado } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface EstadosDistributionProps {
  data: AtendimentoData[];
}

export const EstadosDistribution: React.FC<EstadosDistributionProps> = ({ data }) => {
  const estadosData = getDistribuicaoPorEstado(data);
  const maxCount = Math.max(...estadosData.map(e => e.count));

  const getIntensityClass = (count: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.8) return 'bg-neon-green shadow-neon border-neon-green';
    if (intensity > 0.6) return 'bg-neon-cyan shadow-cyan border-neon-cyan';
    if (intensity > 0.4) return 'bg-neon-purple shadow-purple border-neon-purple';
    if (intensity > 0.2) return 'bg-neon-pink shadow-purple border-neon-pink';
    return 'bg-neon-orange/60 border-neon-orange';
  };

  const getTextColor = (count: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.8) return 'text-primary-foreground';
    if (intensity > 0.6) return 'text-primary-foreground';
    if (intensity > 0.4) return 'text-primary-foreground';
    if (intensity > 0.2) return 'text-primary-foreground';
    return 'text-primary-foreground';
  };

  const getSize = (count: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.8) return 'w-24 h-24 text-lg';
    if (intensity > 0.6) return 'w-20 h-20 text-base';
    if (intensity > 0.4) return 'w-16 h-16 text-sm';
    if (intensity > 0.2) return 'w-14 h-14 text-sm';
    return 'w-12 h-12 text-xs';
  };

  return (
    <Card className="bg-gradient-card border border-neon-green/20 shadow-neon">
      <CardHeader>
        <CardTitle className="text-neon-green flex items-center gap-2">
          🗺️ Distribuição por Estado
        </CardTitle>
        <CardDescription>
          Visualização em quadrados neon - tamanho e cor proporcionais ao volume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
          {estadosData.map(({ estado, count }) => (
            <div
              key={estado}
              className={cn(
                "rounded-xl border-2 backdrop-blur-sm transition-all duration-300 hover:scale-110 cursor-pointer",
                "flex flex-col items-center justify-center p-2 animate-pulse-neon",
                getIntensityClass(count),
                getSize(count)
              )}
            >
              <div className={cn("font-bold", getTextColor(count))}>
                {estado}
              </div>
              <div className={cn("text-xs opacity-90", getTextColor(count))}>
                {count}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neon-green shadow-neon"></div>
            <span className="text-sm text-muted-foreground">Alto volume (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neon-cyan shadow-cyan"></div>
            <span className="text-sm text-muted-foreground">Médio-alto (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neon-purple shadow-purple"></div>
            <span className="text-sm text-muted-foreground">Médio (40-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neon-pink"></div>
            <span className="text-sm text-muted-foreground">Baixo-médio (20-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neon-orange/60"></div>
            <span className="text-sm text-muted-foreground">Baixo volume (&lt;20%)</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 p-4 bg-neon-green/5 rounded-lg border border-neon-green/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-neon-green font-bold text-lg">{estadosData.length}</div>
              <div className="text-xs text-muted-foreground">Estados ativos</div>
            </div>
            <div>
              <div className="text-neon-cyan font-bold text-lg">{estadosData[0]?.estado || 'N/A'}</div>
              <div className="text-xs text-muted-foreground">Estado líder</div>
            </div>
            <div>
              <div className="text-neon-purple font-bold text-lg">{estadosData[0]?.count || 0}</div>
              <div className="text-xs text-muted-foreground">Maior volume</div>
            </div>
            <div>
              <div className="text-neon-pink font-bold text-lg">
                {estadosData.length > 0 ? (data.length / estadosData.length).toFixed(1) : 0}
              </div>
              <div className="text-xs text-muted-foreground">Média por estado</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};