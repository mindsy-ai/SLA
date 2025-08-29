import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface DateRangePickerProps {
  dateRange: { from: Date; to: Date };
  onDateChange: (range: { from: Date; to: Date }) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateRange,
  onDateChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePresetClick = (preset: string) => {
    const today = new Date();
    let from: Date;
    let to = today;

    switch (preset) {
      case 'hoje':
        from = today;
        break;
      case 'ontem':
        from = new Date(today);
        from.setDate(today.getDate() - 1);
        to = from;
        break;
      case '7dias':
        from = new Date(today);
        from.setDate(today.getDate() - 7);
        break;
      case '30dias':
        from = new Date(today);
        from.setDate(today.getDate() - 30);
        break;
      case 'semana':
        from = new Date(today);
        from.setDate(today.getDate() - today.getDay());
        break;
      case 'mes':
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      default:
        return;
    }

    onDateChange({ from, to });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'hoje', label: 'Hoje' },
          { key: '7dias', label: '7 dias' },
          { key: '30dias', label: '30 dias' },
          { key: 'mes', label: 'Este mês' }
        ].map((preset) => (
          <Badge
            key={preset.key}
            variant="outline"
            className="cursor-pointer hover:bg-neon-green/10 hover:border-neon-green/30 hover:text-neon-green transition-colors"
            onClick={() => handlePresetClick(preset.key)}
          >
            {preset.label}
          </Badge>
        ))}
      </div>

      {/* Custom Date Range Picker */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal border-neon-cyan/20 hover:border-neon-cyan/40 hover:bg-neon-cyan/5",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-neon-cyan" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd MMM", { locale: ptBR })} -{" "}
                  {format(dateRange.to, "dd MMM yyyy", { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, "dd MMM yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione o período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onDateChange({ from: range.from, to: range.to });
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};