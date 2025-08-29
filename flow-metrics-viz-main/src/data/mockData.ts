// Mock data simulating Google Sheets data
export interface AtendimentoData {
  data: string;
  atendimento_id: string;
  tipo_atendimento: string;
  reuniao_agendada: boolean;
  status_atendimento: string;
  estado: string;
  ddd: string;
}

// Generate realistic data for the last 30 days
export const generateMockData = (): AtendimentoData[] => {
  const data: AtendimentoData[] = [];
  const today = new Date();
  const estados = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'DF'];
  const ddds = {
    'SP': ['11', '12', '13', '14', '15', '16', '17', '18', '19'],
    'RJ': ['21', '22', '24'],
    'MG': ['31', '32', '33', '34', '35', '37', '38'],
    'RS': ['51', '53', '54', '55'],
    'PR': ['41', '42', '43', '44', '45', '46'],
    'SC': ['47', '48', '49'],
    'BA': ['71', '73', '74', '75', '77'],
    'GO': ['62', '64'],
    'PE': ['81', '87'],
    'DF': ['61']
  };
  const tiposAtendimento = ['Vendas', 'Suporte', 'Consulta', 'Reagendamento', 'Cancelamento'];
  const statusAtendimento = ['Concluído', 'Em Andamento', 'Pendente', 'Cancelado'];

  // Generate data for last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random number of calls per day (15-50)
    const callsPerDay = Math.floor(Math.random() * 35) + 15;
    
    for (let j = 0; j < callsPerDay; j++) {
      const estado = estados[Math.floor(Math.random() * estados.length)];
      const dddArray = (ddds as any)[estado];
      const ddd = dddArray[Math.floor(Math.random() * dddArray.length)];
      
      data.push({
        data: dateStr,
        atendimento_id: `ATD${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
        tipo_atendimento: tiposAtendimento[Math.floor(Math.random() * tiposAtendimento.length)],
        reuniao_agendada: Math.random() > 0.7, // 30% chance of scheduling a meeting
        status_atendimento: statusAtendimento[Math.floor(Math.random() * statusAtendimento.length)],
        estado,
        ddd
      });
    }
  }
  
  return data.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
};

export const mockData = generateMockData();

// Helper functions for data analysis
export const getDateRange = (data: AtendimentoData[]) => {
  const dates = data.map(d => new Date(d.data));
  return {
    min: new Date(Math.min(...dates.map(d => d.getTime()))),
    max: new Date(Math.max(...dates.map(d => d.getTime())))
  };
};

export const filterDataByDateRange = (data: AtendimentoData[], startDate: Date, endDate: Date) => {
  return data.filter(d => {
    const date = new Date(d.data);
    return date >= startDate && date <= endDate;
  });
};

export const getMetrics = (data: AtendimentoData[]) => {
  const totalAtendimentos = data.length;
  const reunioesAgendadas = data.filter(d => d.reuniao_agendada).length;
  const statusConcluido = data.filter(d => d.status_atendimento === 'Concluído').length;
  
  return {
    totalAtendimentos,
    reunioesAgendadas,
    statusConcluido,
    taxaConversao: totalAtendimentos > 0 ? (reunioesAgendadas / totalAtendimentos) * 100 : 0
  };
};

export const getAtendimentosPorDia = (data: AtendimentoData[]) => {
  const grouped = data.reduce((acc, curr) => {
    const date = curr.data;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getReunioesAgendadasPorDia = (data: AtendimentoData[]) => {
  const grouped = data
    .filter(d => d.reuniao_agendada)
    .reduce((acc, curr) => {
      const date = curr.data;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  return Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getDistribuicaoPorEstado = (data: AtendimentoData[]) => {
  const grouped = data.reduce((acc, curr) => {
    const key = `${curr.estado}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(grouped)
    .map(([estado, count]) => ({ estado, count }))
    .sort((a, b) => b.count - a.count);
};

export const getTiposAtendimento = (data: AtendimentoData[]) => {
  const grouped = data.reduce((acc, curr) => {
    acc[curr.tipo_atendimento] = (acc[curr.tipo_atendimento] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(grouped)
    .map(([tipo, count]) => ({ tipo, count }))
    .sort((a, b) => b.count - a.count);
};