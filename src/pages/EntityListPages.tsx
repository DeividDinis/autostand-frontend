import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil } from 'lucide-react';
import { DataTable, type Column } from '../components/DataTable';
import { PageHeader } from '../components/PageHeader';
import { Badge } from '../components/Badge';
import { ErrorState } from '../components/StateView';
import { money, date } from '../utils/format';
import { useAuth } from '../contexts/AuthContext';
import { canCreateVehicle, isAdminGlobal } from '../utils/permissions';
import { vehiclesApi } from '../api/vehicles.api';
import { clientsApi } from '../api/clients.api';
import { standsApi } from '../api/stands.api';
import { processesApi } from '../api/processes.api';
import { contractsApi } from '../api/contracts.api';
import { installmentsApi } from '../api/installments.api';
import { paymentsApi } from '../api/payments.api';
import { rentalReturnsApi } from '../api/rental-returns.api';
import { transfersApi } from '../api/transfers.api';
import { usersApi } from '../api/users.api';
import type {
  Vehicle,
  Client,
  Stand,
  Process,
  Contract,
  Installment,
  Payment,
  RentalReturn,
  Transfer,
  User,
} from '../types/domain';

type ListResponse<T> = { data: T[]; total?: number };
type ListState<T> = {
  rows: T[];
  total?: number;
  loading: boolean;
  error: string;
};

type LoadFn<T> = (page: number) => Promise<ListResponse<T>>;

function useList<T>(load: LoadFn<T>, watch: readonly unknown[] = []) {
  const [state, setState] = useState<ListState<T>>({
    rows: [],
    loading: true,
    error: '',
  });
  const [page, setPage] = useState(1);

  const run = (pageNumber: number) => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    load(pageNumber)
      .then((response) =>
        setState({
          rows: response.data ?? [],
          total: response.total,
          loading: false,
          error: '',
        })
      )
      .catch((error: unknown) =>
        setState((current) => ({
          ...current,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os dados.',
        }))
      );
  };

  useEffect(() => {
    run(page);
    // `load` is intentionally supplied by the page and the explicit `watch` values
    // determine when the request must be repeated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ...watch]);

  const reload = () => run(page);

  return { ...state, page, setPage, reload };
}

function ErrorSlot({
  state,
}: {
  state: { error: string; reload: () => void };
}) {
  return state.error ? (
    <div className="mt-4">
      <ErrorState text={state.error} retry={state.reload} />
    </div>
  ) : null;
}

export function VehiclesPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const list = useList<Vehicle>(
    (page) =>
      vehiclesApi.list({
        page,
        limit: 10,
        search,
        standId: user?.role === 'ADMIN_GLOBAL' ? undefined : user?.standIds[0],
      }),
    [search]
  );

  const columns: Column<Vehicle>[] = [
    {
      key: 'brand',
      header: 'Veículo',
      render: (row) => (
        <div>
          <b>
            {row.brand} {row.model}
          </b>
          <div className="text-xs text-slate-400">{row.color || '—'}</div>
        </div>
      ),
    },
    { key: 'plate', header: 'Matrícula' },
    { key: 'year', header: 'Ano' },
    {
      key: 'stand',
      header: 'Stand',
      render: (row) => row.stand?.name || row.standId,
    },
    {
      key: 'salePrice',
      header: 'Preço',
      render: (row) => money(row.salePrice),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <Badge value={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => nav(`/vehicles/${row.id}`)}
            className="rounded-lg p-2 hover:bg-slate-100"
            aria-label="Ver veículo"
          >
            <Eye size={16} />
          </button>
          {canCreateVehicle(user) && (
            <button
              onClick={() => nav(`/vehicles/${row.id}/edit`)}
              className="rounded-lg p-2 hover:bg-slate-100"
              aria-label="Editar veículo"
            >
              <Pencil size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Veículos"
        subtitle="Inventário operacional por stand"
        action={
          canCreateVehicle(user) ? (
            <Link
              to="/vehicles/new"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white"
            >
              <Plus size={17} /> Novo veículo
            </Link>
          ) : undefined
        }
      />
      <DataTable
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        total={list.total}
        page={list.page}
        onPageChange={list.setPage}
        search={search}
        onSearch={(value) => {
          setSearch(value);
          list.setPage(1);
        }}
        emptyText="Nenhum veículo encontrado."
      />
      <ErrorSlot state={list} />
    </>
  );
}

export function ClientsPage() {
  const nav = useNavigate();
  const [search, setSearch] = useState('');
  const list = useList<Client>(
    (page) => clientsApi.list({ page, limit: 10, search }),
    [search]
  );

  const columns: Column<Client>[] = [
    { key: 'name', header: 'Cliente', render: (row) => <b>{row.name}</b> },
    { key: 'phone', header: 'Telefone' },
    { key: 'email', header: 'E-mail' },
    { key: 'document', header: 'Documento' },
    { key: 'processesCount', header: 'Processos' },
    { key: 'contractsCount', header: 'Contratos' },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          onClick={() => nav(`/clients/${row.id}`)}
          className="rounded-lg p-2 hover:bg-slate-100"
          aria-label={`Ver detalhes do cliente ${row.name}`}
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle="Base de clientes e histórico operacional"
        action={
          <Link
            to="/clients/new"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white"
          >
            <Plus size={17} /> Novo cliente
          </Link>
        }
      />
      <DataTable
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        total={list.total}
        page={list.page}
        onPageChange={list.setPage}
        search={search}
        onSearch={(value) => {
          setSearch(value);
          list.setPage(1);
        }}
        emptyText="Nenhum cliente encontrado."
      />
      <ErrorSlot state={list} />
    </>
  );
}

export function StandsPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const list = useList<Stand>(
    (page) => {
      if (user?.role === 'MINI_ADMIN') {
        return Promise.all(
          user.standIds.map((standId) => standsApi.get(standId))
        ).then((data) => ({
          data,
          total: data.length,
        }));
      }
      return standsApi.list({ page, limit: 10 });
    },
    [user?.role, user?.standIds.join(',')]
  );

  const columns: Column<Stand>[] = [
    {
      key: 'name',
      header: 'Stand',
      render: (row) => (
        <div>
          <b>{row.name}</b>
          <div className="text-xs text-slate-400">{row.code}</div>
        </div>
      ),
    },
    { key: 'phone', header: 'Telefone' },
    { key: 'address', header: 'Endereço' },
    {
      key: 'parentStand',
      header: 'Stand pai',
      render: (row) =>
        row.parentStand?.name || row.parentStandId || 'Principal',
    },
    { key: 'vehicleCount', header: 'Veículos' },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <Badge value={row.status || 'ACTIVE'} />,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          onClick={() => nav(`/stands/${row.id}`)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Stands"
        subtitle="Estrutura multi-stand e substands"
        action={
          isAdminGlobal(user) ? (
            <Link
              to="/stands/new"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white"
            >
              <Plus size={17} /> Novo stand
            </Link>
          ) : undefined
        }
      />
      <DataTable
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        total={list.total}
        page={list.page}
        onPageChange={list.setPage}
      />
      <ErrorSlot state={list} />
    </>
  );
}

export function UsersPage() {
  const nav = useNavigate();
  const list = useList<User>((page) => usersApi.list({ page, limit: 10 }));

  const columns: Column<User>[] = [
    { key: 'name', header: 'Utilizador', render: (row) => <b>{row.name}</b> },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Cargo',
      render: (row) => <Badge value={row.role} />,
    },
    { key: 'phone', header: 'Telefone' },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <Badge value={row.status || 'ACTIVE'} />,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          onClick={() => nav(`/users/${row.id}`)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Utilizadores"
        subtitle="Cargos, estados e stands associados"
        action={
          <Link
            to="/users/new"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white"
          >
            <Plus size={17} /> Novo utilizador
          </Link>
        }
      />
      <DataTable
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        total={list.total}
        page={list.page}
        onPageChange={list.setPage}
      />
      <ErrorSlot state={list} />
    </>
  );
}

export function ProcessesPage({ type }: { type?: 'SALE' | 'RENTAL' }) {
  const nav = useNavigate();
  const { user } = useAuth();
  const list = useList<Process>(
    (page) =>
      processesApi.list({
        page,
        limit: 10,
        type,
        standId: user?.role === 'ADMIN_GLOBAL' ? undefined : user?.standIds[0],
      }),
    [type, user?.role, ...(user?.standIds ?? [])]
  );

  const columns: Column<Process>[] = [
    { key: 'id', header: 'Processo', render: (row) => <b>#{row.id}</b> },
    {
      key: 'type',
      header: 'Tipo',
      render: (row) => <Badge value={row.type} />,
    },
    {
      key: 'client',
      header: 'Cliente',
      render: (row) => row.client?.name || row.clientId,
    },
    {
      key: 'vehicle',
      header: 'Veículo',
      render: (row) =>
        row.vehicle
          ? `${row.vehicle.brand} ${row.vehicle.model}`
          : row.vehicleId,
    },
    {
      key: 'stand',
      header: 'Stand',
      render: (row) => row.stand?.name || row.standId,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <Badge value={row.status} />,
    },
    { key: 'createdAt', header: 'Data', render: (row) => date(row.createdAt) },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          onClick={() => nav(`/processes/${row.id}`)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  const title =
    type === 'SALE' ? 'Vendas' : type === 'RENTAL' ? 'Alugueres' : 'Processos';

  return (
    <>
      <PageHeader
        title={title}
        subtitle={
          type
            ? `Processos do tipo ${type === 'SALE' ? 'venda' : 'aluguer'}`
            : 'Negociações e operações em curso'
        }
        action={
          !type ? (
            <Link
              to="/processes/new"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white"
            >
              <Plus size={17} /> Novo processo
            </Link>
          ) : undefined
        }
      />
      <DataTable
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        total={list.total}
        page={list.page}
        onPageChange={list.setPage}
      />
      <ErrorSlot state={list} />
    </>
  );
}

export function ContractsPage({ type }: { type?: 'SALE' | 'RENTAL' }) {
  const nav = useNavigate();
  const { user } = useAuth();
  const list = useList<Contract>(
    (page) =>
      contractsApi.list({
        page,
        limit: 10,
        type,
        standId: user?.role === 'ADMIN_GLOBAL' ? undefined : user?.standIds[0],
      }),
    [type, user?.role, ...(user?.standIds ?? [])]
  );

  const columns: Column<Contract>[] = [
    { key: 'id', header: 'Contrato', render: (row) => <b>#{row.id}</b> },
    {
      key: 'type',
      header: 'Tipo',
      render: (row) => <Badge value={row.type} />,
    },
    {
      key: 'client',
      header: 'Cliente',
      render: (row) => row.client?.name || row.clientId,
    },
    {
      key: 'vehicle',
      header: 'Veículo',
      render: (row) =>
        row.vehicle
          ? `${row.vehicle.brand} ${row.vehicle.model}`
          : row.vehicleId,
    },
    {
      key: 'totalAmount',
      header: 'Valor',
      render: (row) => money(row.totalAmount),
    },
    {
      key: 'amountPaid',
      header: 'Pago',
      render: (row) => money(row.amountPaid),
    },
    { key: 'balance', header: 'Saldo', render: (row) => money(row.balance) },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <Badge value={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          onClick={() => nav(`/contracts/${row.id}`)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Contratos"
        subtitle={
          type
            ? `Contratos de ${type === 'SALE' ? 'venda' : 'aluguer'}`
            : 'Contratos de venda e aluguer'
        }
      />
      <DataTable
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        total={list.total}
        page={list.page}
        onPageChange={list.setPage}
      />
      <ErrorSlot state={list} />
    </>
  );
}

export function InstallmentsPage() {
  const list = useList<Installment>((page) =>
    installmentsApi.list({ page, limit: 10 })
  );
  const columns: Column<Installment>[] = [
    { key: 'number', header: 'Nº' },
    {
      key: 'contract',
      header: 'Contrato',
      render: (row) =>
        row.contract ? `#${row.contract.id}` : `#${row.contractId}`,
    },
    {
      key: 'dueDate',
      header: 'Vencimento',
      render: (row) => date(row.dueDate),
    },
    { key: 'amount', header: 'Valor', render: (row) => money(row.amount) },
    {
      key: 'paidAmount',
      header: 'Pago',
      render: (row) => money(row.paidAmount),
    },
    { key: 'balance', header: 'Saldo', render: (row) => money(row.balance) },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <Badge value={row.status} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Prestações"
        subtitle="Acompanhamento dos planos de pagamento"
      />
      <DataTable
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        total={list.total}
        page={list.page}
        onPageChange={list.setPage}
      />
      <ErrorSlot state={list} />
    </>
  );
}

export function PaymentsPage() {
  const list = useList<Payment>((page) =>
    paymentsApi.list({ page, limit: 10 })
  );
  const columns: Column<Payment>[] = [
    { key: 'id', header: 'Pagamento', render: (row) => <b>#{row.id}</b> },
    {
      key: 'contractId',
      header: 'Contrato',
      render: (row) => `#${row.contractId}`,
    },
    {
      key: 'installmentId',
      header: 'Prestação',
      render: (row) => (row.installmentId ? `#${row.installmentId}` : '—'),
    },
    { key: 'amount', header: 'Valor', render: (row) => money(row.amount) },
    {
      key: 'method',
      header: 'Método',
      render: (row) => <Badge value={row.method} />,
    },
    { key: 'reference', header: 'Referência' },
    { key: 'createdAt', header: 'Data', render: (row) => date(row.createdAt) },
  ];

  return (
    <>
      <PageHeader
        title="Pagamentos"
        subtitle="Comprovativos e movimentos operacionais"
      />
      <DataTable
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        total={list.total}
        page={list.page}
        onPageChange={list.setPage}
      />
      <ErrorSlot state={list} />
    </>
  );
}

export function RentalReturnsPage() {
  const list = useList<RentalReturn>((page) =>
    rentalReturnsApi.list({ page, limit: 10 })
  );
  const columns: Column<RentalReturn>[] = [
    { key: 'id', header: 'Devolução', render: (row) => <b>#{row.id}</b> },
    {
      key: 'contractId',
      header: 'Contrato',
      render: (row) => `#${row.contractId}`,
    },
    {
      key: 'vehicle',
      header: 'Veículo',
      render: (row) =>
        row.vehicle
          ? `${row.vehicle.brand} ${row.vehicle.model}`
          : row.vehicleId,
    },
    { key: 'mileage', header: 'Km' },
    { key: 'condition', header: 'Condição' },
    { key: 'damages', header: 'Danos', render: (row) => row.damages || '—' },
    { key: 'createdAt', header: 'Data', render: (row) => date(row.createdAt) },
  ];

  return (
    <>
      <PageHeader
        title="Devoluções"
        subtitle="Fichas de devolução de veículos alugados"
      />
      <DataTable
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        total={list.total}
        page={list.page}
        onPageChange={list.setPage}
      />
      <ErrorSlot state={list} />
    </>
  );
}

export function TransfersPage() {
  const nav = useNavigate();
  const list = useList<Transfer>((page) =>
    transfersApi.list({ page, limit: 10 })
  );
  const columns: Column<Transfer>[] = [
    { key: 'id', header: 'Transferência', render: (row) => <b>#{row.id}</b> },
    {
      key: 'vehicle',
      header: 'Veículo',
      render: (row) =>
        row.vehicle
          ? `${row.vehicle.brand} ${row.vehicle.model}`
          : row.vehicleId,
    },
    {
      key: 'fromStand',
      header: 'Origem',
      render: (row) => row.fromStand?.name || row.fromStandId,
    },
    {
      key: 'toStand',
      header: 'Destino',
      render: (row) => row.toStand?.name || row.toStandId,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <Badge value={row.status} />,
    },
    {
      key: 'createdAt',
      header: 'Solicitada',
      render: (row) => date(row.createdAt),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          onClick={() => nav(`/transfers/${row.id}`)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Transferências"
        subtitle="Movimentação de veículos entre stands"
        action={
          <Link
            to="/transfers/new"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white"
          >
            <Plus size={17} /> Nova transferência
          </Link>
        }
      />
      <DataTable
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        total={list.total}
        page={list.page}
        onPageChange={list.setPage}
      />
      <ErrorSlot state={list} />
    </>
  );
}
