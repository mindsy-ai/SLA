import React, { useState, useMemo } from 'react';
import { Calendar, BarChart3, MapPin, List, TrendingUp, Users, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MetricCard } from './MetricCard';
import { AtendimentosChart } from './AtendimentosChart';
import { ReunioesChart } from './ReunioesChart';
import { TiposAtendimentoChart } from './TiposAtendimentoChart';
import { EstadosDistribution } from './EstadosDistribution';
import { AtendimentosTable } from './AtendimentosTable';
import { DateRangePicker } from './DateRangePicker';
import { filterDataByDateRange, getMetrics } from '@/data/mockData';
import { useGoogleSheetsData } from '@/hooks/useGoogleSheetsData';

export const Dashboard = () => {
  const { data: googleSheetsData, loading, error, refreshData } = useGoogleSheetsData();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    return { from: lastWeek, to: today };
  });

  const filteredData = useMemo(() => {
    return filterDataByDateRange(googleSheetsData, dateRange.from, dateRange.to);
  }, [dateRange, googleSheetsData]);

  const metrics = useMemo(() => {
    return getMetrics(filteredData);
  }, [filteredData]);

  // Calculate previous period for comparison
  const previousPeriodData = useMemo(() => {
    const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    const prevStart = new Date(dateRange.from);
    prevStart.setDate(prevStart.getDate() - daysDiff);
    const prevEnd = new Date(dateRange.from);
    
    return filterDataByDateRange(googleSheetsData, prevStart, prevEnd);
  }, [dateRange, googleSheetsData]);

  const previousMetrics = useMemo(() => {
    return getMetrics(previousPeriodData);
  }, [previousPeriodData]);

  const calculateChange = (current: number, previous: number): { value: number; isIncrease: boolean } => {
    if (previous === 0) return { value: 0, isIncrease: true };
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isIncrease: change >= 0 };
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-neon bg-clip-text text-transparent">
              Dashboard Interativo
            </h1>
            <p className="text-muted-foreground mt-2">
              Dados sincronizados com Google Sheets em tempo real
            </p>
            {error && (
              <p className="text-destructive text-sm mt-1">
                Erro na sincronização: {error}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={refreshData} 
              variant="outline" 
              size="sm" 
              disabled={loading}
              className="border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Sincronizando...' : 'Atualizar Dados'}
            </Button>
            <DateRangePicker dateRange={dateRange} onDateChange={setDateRange} />
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-secondary/50 backdrop-blur-sm">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-neon data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="w-4 h-4" />
              Resumo Geral
            </TabsTrigger>
            <TabsTrigger 
              value="charts" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-neon data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="w-4 h-4" />
              Gráficos por Dia
            </TabsTrigger>
            <TabsTrigger 
              value="distribution" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-neon data-[state=active]:text-primary-foreground"
            >
              <MapPin className="w-4 h-4" />
              Distribuição
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-neon data-[state=active]:text-primary-foreground"
            >
              <List className="w-4 h-4" />
              Lista Detalhada
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total de Atendimentos"
                value={metrics.totalAtendimentos}
                icon={Users}
                change={calculateChange(metrics.totalAtendimentos, previousMetrics.totalAtendimentos)}
                color="neon-green"
              />
              <MetricCard
                title="Reuniões Agendadas"
                value={metrics.reunioesAgendadas}
                icon={Calendar}
                change={calculateChange(metrics.reunioesAgendadas, previousMetrics.reunioesAgendadas)}
                color="neon-cyan"
              />
              <MetricCard
                title="Atendimentos Concluídos"
                value={metrics.statusConcluido}
                icon={CheckCircle}
                change={calculateChange(metrics.statusConcluido, previousMetrics.statusConcluido)}
                color="neon-purple"
              />
              <MetricCard
                title="Taxa de Conversão"
                value={metrics.taxaConversao}
                icon={TrendingUp}
                change={calculateChange(metrics.taxaConversao, previousMetrics.taxaConversao)}
                color="neon-pink"
                suffix="%"
                isPercentage
              />
            </div>

            {/* Charts Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border border-neon-green/20 shadow-neon">
                <CardHeader>
                  <CardTitle className="text-neon-green">Tipos de Atendimento</CardTitle>
                  <CardDescription>Distribuição por categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <TiposAtendimentoChart data={filteredData} />
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border border-neon-cyan/20 shadow-cyan">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Resumo de Insights</CardTitle>
                  <CardDescription>Análise do período selecionado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Período analisado</span>
                    <Badge variant="outline" className="border-neon-cyan/30 text-neon-cyan">
                      {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} dias
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Média diária</span>
                    <span className="text-neon-cyan font-medium">
                      {(metrics.totalAtendimentos / Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))).toFixed(1)} atendimentos
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estado mais ativo</span>
                    <span className="text-neon-cyan font-medium">SP</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AtendimentosChart data={filteredData} />
              <ReunioesChart data={filteredData} />
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <EstadosDistribution data={filteredData} />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <AtendimentosTable data={filteredData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};