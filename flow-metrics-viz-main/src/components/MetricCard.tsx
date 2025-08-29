import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  change: { value: number; isIncrease: boolean };
  color: 'neon-green' | 'neon-cyan' | 'neon-purple' | 'neon-pink' | 'neon-orange';
  suffix?: string;
  isPercentage?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  color,
  suffix = '',
  isPercentage = false
}) => {
  const colorClasses = {
    'neon-green': {
      border: 'border-neon-green/20',
      shadow: 'shadow-neon',
      text: 'text-neon-green',
      gradient: 'from-neon-green/20 to-transparent'
    },
    'neon-cyan': {
      border: 'border-neon-cyan/20',
      shadow: 'shadow-cyan',
      text: 'text-neon-cyan',
      gradient: 'from-neon-cyan/20 to-transparent'
    },
    'neon-purple': {
      border: 'border-neon-purple/20', 
      shadow: 'shadow-purple',
      text: 'text-neon-purple',
      gradient: 'from-neon-purple/20 to-transparent'
    },
    'neon-pink': {
      border: 'border-neon-pink/20',
      shadow: 'shadow-purple',
      text: 'text-neon-pink',
      gradient: 'from-neon-pink/20 to-transparent'
    },
    'neon-orange': {
      border: 'border-neon-orange/20',
      shadow: 'shadow-neon',
      text: 'text-neon-orange',
      gradient: 'from-neon-orange/20 to-transparent'
    }
  };

  const displayValue = isPercentage ? value.toFixed(1) : value.toLocaleString();

  return (
    <Card className={cn(
      "bg-gradient-card backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg",
      colorClasses[color].border,
      colorClasses[color].shadow
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg bg-gradient-to-br",
          colorClasses[color].gradient
        )}>
          <Icon className={cn("h-4 w-4", colorClasses[color].text)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className={cn("text-2xl font-bold", colorClasses[color].text)}>
              {displayValue}{suffix}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {change.isIncrease ? (
                <TrendingUp className="h-3 w-3 text-neon-green" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs border-0",
                  change.isIncrease 
                    ? "bg-neon-green/10 text-neon-green" 
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {change.isIncrease ? '+' : '-'}{change.value.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};