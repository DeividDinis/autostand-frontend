import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowLeftRight,
  CarFront,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Gauge,
  Plus,
  RotateCcw,
  Users,
  Wrench,
} from 'lucide-react';
import { dashboardApi } from '../api/dashboard.api';
import type { DashboardData } from '../types/domain';
import { PageHeader } from '../components/PageHeader';
import { LoadingState, ErrorState } from '../components/StateView';
import { money, date } from '../utils/format';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { canCreateVehicle } from '../utils/permissions';
const cards = [
  ['totalVehicles', 'Total de veículos', CarFront],
  ['available', 'Disponíveis', CarFront],
  ['sold', 'Vendidos', CircleDollarSign],
  ['rented', 'Alugados', Activity],
  ['maintenance', 'Manutenção', Wrench],
  ['activeProcesses', 'Processos ativos', ClipboardList],
  ['activeContracts', 'Contratos ativos', FileText],
  ['pendingTransfers', 'Transferências pendentes', ArrowLeftRight],
] as const;
export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = () => {
    setLoading(true);
    setError('');
    dashboardApi
      .get(
        user?.role === 'ADMIN_GLOBAL'
          ? undefined
          : { standId: user?.standIds[0] }
      )
      .then(setData)
      .catch((e) =>
        setError(
          e instanceof Error
            ? e.message
            : 'Não foi possível carregar o dashboard.'
        )
      )
      .finally(() => setLoading(false));
  };
  useEffect(load, [user?.role, user?.standIds]);
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Resumo operacional em tempo real"
        action={
          canCreateVehicle(user) ? (
            <div className="flex gap-2">
              <Link
                to="/vehicles/new"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Plus size={17} /> Novo veículo
              </Link>
            </div>
          ) : undefined
        }
      />
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState text={error} retry={load} />
      ) : (
        data && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map(([key, label, Icon]) => (
                <div
                  key={key}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon size={19} />
                    </div>
                    <span className="text-xs text-slate-400">API</span>
                  </div>
                  <p className="mt-5 text-sm text-slate-500">{label}</p>
                  <p className="mt-1 text-2xl font-black">
                    {(data.cards as any)[key] ?? 0}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid gap-6 xl:grid-cols-3">
              <ChartCard
                title="Vendas por período"
                items={data.salesByPeriod}
              />
              <ChartCard
                title="Alugueres por período"
                items={data.rentalsByPeriod}
              />
              <ChartCard
                title="Recebimentos"
                items={data.receiptsByPeriod}
                moneyMode
              />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold">Veículos por estado</h2>
                    <p className="text-sm text-slate-400">
                      Distribuição devolvida pela API
                    </p>
                  </div>
                  <Gauge size={19} className="text-slate-400" />
                </div>
                <div className="space-y-3">
                  {data.vehiclesByStatus?.map((x) => (
                    <div key={x.label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{x.label}</span>
                        <b>{x.value}</b>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-red-600"
                          style={{ width: `${Math.min(100, x.value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold">Atividade recente</h2>
                    <p className="text-sm text-slate-400">Últimas operações</p>
                  </div>
                  <RotateCcw size={18} className="text-slate-400" />
                </div>
                <div className="space-y-3">
                  {data.recentActivity?.map((a) => (
                    <div key={a.id} className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-red-600">
                          {a.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {date(a.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-700">
                        {a.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <Users size={18} />
                <h2 className="font-bold">Performance por stand</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {data.performanceByStand?.map((x) => (
                  <div
                    key={x.label}
                    className="rounded-xl border border-slate-100 p-4"
                  >
                    <p className="text-xs text-slate-400">{x.label}</p>
                    <p className="mt-1 text-xl font-black">{money(x.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}
function ChartCard({
  title,
  items,
  moneyMode,
}: {
  title: string;
  items: { label: string; value: number }[];
  moneyMode?: boolean;
}) {
  const max = Math.max(...(items || []).map((x) => x.value), 1);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-bold">{title}</h2>
      <div className="mt-5 flex h-48 items-end gap-2">
        {(items || []).map((x) => (
          <div
            key={x.label}
            className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
          >
            <div
              className="w-full rounded-t-lg bg-red-100"
              style={{ height: `${Math.max(8, (x.value / max) * 145)}px` }}
              title={moneyMode ? money(x.value) : String(x.value)}
            >
              <div className="h-full rounded-t-lg bg-red-600" />
            </div>
            <span className="max-w-full truncate text-[10px] text-slate-400">
              {x.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
