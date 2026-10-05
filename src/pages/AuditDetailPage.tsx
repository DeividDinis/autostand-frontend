import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { LoadingState, ErrorState } from '../components/StateView';
import { Badge } from '../components/Badge';
import { auditApi } from '../api/audit.api';
import { date } from '../utils/format';
export function AuditDetailPage() {
  const { id } = useParams();
  const [d, setD] = useState<any>();
  const [e, setE] = useState('');
  useEffect(() => {
    auditApi
      .get(Number(id))
      .then(setD)
      .catch((x) => setE(x.message));
  }, [id]);
  if (e) return <ErrorState text={e} />;
  if (!d) return <LoadingState />;
  return (
    <>
      <PageHeader
        title={`Log de auditoria #${d.id}`}
        subtitle="Detalhe da operação auditada"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-bold">Metadados</h2>
          <div className="divide-y divide-slate-100">
            {[
              ['Data', date(d.createdAt)],
              ['Utilizador', d.user?.name || d.userId],
              ['Ação', d.action],
              ['Método', <Badge value={d.method} />],
              ['Status', <Badge value={String(d.status)} />],
              ['Endpoint', d.endpoint],
              ['Entidade', d.entity],
              ['Stand', d.standId || '—'],
            ].map(([k, v]) => (
              <div
                key={String(k)}
                className="flex justify-between gap-4 py-3 text-sm"
              >
                <span className="text-slate-400">{k}</span>
                <span className="text-right font-medium text-slate-700">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-bold">Resposta completa</h2>
          <pre className="overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-300">
            {JSON.stringify(d, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}
