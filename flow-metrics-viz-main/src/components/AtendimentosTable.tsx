import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { AtendimentoData } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AtendimentosTableProps {
  data: AtendimentoData[];
}

export const AtendimentosTable: React.FC<AtendimentosTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof AtendimentoData>('data');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTipo, setFilterTipo] = useState<string>('all');

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.atendimento_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ddd.includes(searchTerm);
      
      const matchesStatus = filterStatus === 'all' || item.status_atendimento === filterStatus;
      const matchesTipo = filterTipo === 'all' || item.tipo_atendimento === filterTipo;
      
      return matchesSearch && matchesStatus && matchesTipo;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'data') {
        const aTime = new Date(aValue as string).getTime();
        const bTime = new Date(bValue as string).getTime();
        if (aTime < bTime) return sortDirection === 'asc' ? -1 : 1;
        if (aTime > bTime) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [data, searchTerm, filterStatus, filterTipo, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: keyof AtendimentoData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Concluído': 'bg-neon-green/10 text-neon-green border-neon-green/30',
      'Em Andamento': 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
      'Pendente': 'bg-neon-orange/10 text-neon-orange border-neon-orange/30',
      'Cancelado': 'bg-destructive/10 text-destructive border-destructive/30'
    };
    
    return (
      <Badge variant="outline" className={cn("text-xs", variants[status as keyof typeof variants] || '')}>
        {status}
      </Badge>
    );
  };

  const getTipoBadge = (tipo: string) => {
    const variants = {
      'Vendas': 'bg-neon-green/10 text-neon-green border-neon-green/30',
      'Suporte': 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
      'Consulta': 'bg-neon-purple/10 text-neon-purple border-neon-purple/30',
      'Reagendamento': 'bg-neon-pink/10 text-neon-pink border-neon-pink/30',
      'Cancelamento': 'bg-neon-orange/10 text-neon-orange border-neon-orange/30'
    };
    
    return (
      <Badge variant="outline" className={cn("text-xs", variants[tipo as keyof typeof variants] || '')}>
        {tipo}
      </Badge>
    );
  };

  return (
    <Card className="bg-gradient-card border border-neon-green/20 shadow-neon">
      <CardHeader>
        <CardTitle className="text-neon-green flex items-center gap-2">
          📋 Lista Detalhada de Atendimentos
        </CardTitle>
        <CardDescription>
          Tabela completa com filtros, ordenação e paginação
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, Estado ou DDD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-neon-green/20 focus:border-neon-green/40"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] border-neon-cyan/20">
              <Filter className="w-4 h-4 mr-2 text-neon-cyan" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
              <SelectItem value="Em Andamento">Em Andamento</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-[180px] border-neon-purple/20">
              <Filter className="w-4 h-4 mr-2 text-neon-purple" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="Vendas">Vendas</SelectItem>
              <SelectItem value="Suporte">Suporte</SelectItem>
              <SelectItem value="Consulta">Consulta</SelectItem>
              <SelectItem value="Reagendamento">Reagendamento</SelectItem>
              <SelectItem value="Cancelamento">Cancelamento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead 
                  className="cursor-pointer hover:bg-neon-green/10 transition-colors"
                  onClick={() => handleSort('data')}
                >
                  Data {sortField === 'data' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-neon-cyan/10 transition-colors"
                  onClick={() => handleSort('atendimento_id')}
                >
                  ID {sortField === 'atendimento_id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Reunião</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>DDD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum atendimento encontrado com os filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.atendimento_id} className="hover:bg-neon-green/5 transition-colors">
                    <TableCell className="font-mono text-sm">
                      {format(new Date(item.data), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {item.atendimento_id}
                    </TableCell>
                    <TableCell>
                      {getTipoBadge(item.tipo_atendimento)}
                    </TableCell>
                    <TableCell>
                      {item.reuniao_agendada ? (
                        <Badge variant="outline" className="bg-neon-green/10 text-neon-green border-neon-green/30">
                          ✓ Sim
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/30">
                          ✗ Não
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status_atendimento)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-neon-purple/10 text-neon-purple border-neon-purple/30">
                        {item.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-neon-pink/10 text-neon-pink border-neon-pink/30">
                        ({item.ddd})
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(startIndex + pageSize, filteredAndSortedData.length)} de {filteredAndSortedData.length} registros
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-20 border-neon-green/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">por página</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-neon-cyan/20 hover:bg-neon-cyan/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-8 h-8",
                      currentPage === page 
                        ? "bg-neon-green text-primary-foreground" 
                        : "border-neon-green/20 hover:bg-neon-green/10"
                    )}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="border-neon-cyan/20 hover:bg-neon-cyan/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};