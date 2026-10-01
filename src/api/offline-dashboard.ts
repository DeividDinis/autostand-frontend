import type { DashboardData, Role } from '../types/domain';

export function getOfflineDashboard(role: Role): DashboardData {
  const isClient = role === 'CLIENTE';
  const isMini = role === 'MINI_ADMIN';

  return {
    cards: {
      totalVehicles: isClient ? 1 : isMini ? 18 : 42,
      available: isClient ? 1 : isMini ? 11 : 24,
      sold: isClient ? 0 : isMini ? 3 : 9,
      rented: isClient ? 0 : isMini ? 2 : 5,
      maintenance: isClient ? 0 : isMini ? 1 : 2,
      activeProcesses: isClient ? 0 : isMini ? 4 : 13,
      activeContracts: isClient ? 0 : isMini ? 6 : 17,
      pendingPayments: isClient ? 0 : isMini ? 2 : 7,
      overduePayments: isClient ? 0 : 1,
      pendingTransfers: isClient ? 0 : isMini ? 1 : 3,
    },
    salesByPeriod: [
      { label: 'Mai', value: isClient ? 0 : 4 },
      { label: 'Jun', value: isClient ? 0 : 7 },
      { label: 'Jul', value: isClient ? 0 : 5 },
      { label: 'Ago', value: isClient ? 0 : 9 },
      { label: 'Set', value: isClient ? 0 : 6 },
    ],
    rentalsByPeriod: [
      { label: 'Mai', value: isClient ? 0 : 3 },
      { label: 'Jun', value: isClient ? 0 : 5 },
      { label: 'Jul', value: isClient ? 0 : 4 },
      { label: 'Ago', value: isClient ? 0 : 7 },
      { label: 'Set', value: isClient ? 0 : 8 },
    ],
    receiptsByPeriod: [
      { label: 'Mai', value: isClient ? 0 : 3200000 },
      { label: 'Jun', value: isClient ? 0 : 5100000 },
      { label: 'Jul', value: isClient ? 0 : 4300000 },
      { label: 'Ago', value: isClient ? 0 : 6800000 },
      { label: 'Set', value: isClient ? 0 : 5900000 },
    ],
    vehiclesByStatus: [
      { label: 'Disponíveis', value: isClient ? 1 : isMini ? 11 : 24 },
      { label: 'Em processo', value: isClient ? 0 : isMini ? 2 : 4 },
      { label: 'Vendidos', value: isClient ? 0 : isMini ? 3 : 9 },
      { label: 'Alugados', value: isClient ? 0 : isMini ? 2 : 5 },
      { label: 'Manutenção', value: isClient ? 0 : isMini ? 1 : 2 },
    ],
    performanceByStand: isClient
      ? [{ label: 'Meu acesso', value: 0 }]
      : [
          { label: 'Stand Principal', value: 18400000 },
          { label: 'Revendedora Talatona', value: 9600000 },
          { label: 'Revendedora Viana', value: 7200000 },
        ],
    recentActivity: isClient
      ? [{ id: 1, type: 'PORTAL', description: 'Sessão de demonstração do cliente', createdAt: new Date().toISOString() }]
      : [
          { id: 1, type: 'VENDA', description: 'Contrato de venda #104 concluído', createdAt: new Date().toISOString() },
          { id: 2, type: 'PAGAMENTO', description: 'Pagamento de 1 000 000 Kz registado', createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 3, type: 'TRANSFERÊNCIA', description: 'Transferência #23 aguarda aprovação', createdAt: new Date(Date.now() - 7200000).toISOString() },
          { id: 4, type: 'VEÍCULO', description: 'Toyota Hilux adicionado ao inventário', createdAt: new Date(Date.now() - 86400000).toISOString() },
        ],
  };
}
