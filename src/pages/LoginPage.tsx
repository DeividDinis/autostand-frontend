import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck } from 'lucide-react';
import { loginSchema } from '../schemas/forms';
import { useAuth } from '../contexts/AuthContext';
import { Field, inputClass } from '../components/Field';
import { Button } from '../components/Button';
import { OFFLINE_CREDENTIALS, isOfflineMode } from '../api/offline-auth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = async (data: { email: string; password: string }) => {
    setError('');
    try {
      const loggedUser = await login(data.email, data.password);
      navigate(loggedUser.role === 'CLIENTE' ? '/portal' : '/dashboard', {
        replace: true,
      });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Não foi possível iniciar sessão.'
      );
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-600 font-black">
            A
          </div>
          <span className="font-bold">AutoStand</span>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
            Operations platform
          </p>
          <h1 className="mt-5 max-w-lg text-5xl font-black leading-tight">
            Uma visão operacional de todos os teus stands.
          </h1>
          <p className="mt-5 max-w-lg text-slate-400">
            Veículos, clientes, processos, contratos, pagamentos, alugueres e
            transferências num único painel.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ShieldCheck size={16} />
          {isOfflineMode()
            ? 'Modo de demonstração offline ativo'
            : 'Sessões protegidas por autenticação da API'}
        </div>
      </div>

      <div className="grid place-items-center p-5">
        <form onSubmit={handleSubmit(submit)} className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600">
              <LogIn />
            </div>
            <h2 className="text-3xl font-black">Entrar</h2>
            <p className="mt-2 text-sm text-slate-500">
              Acede ao painel operacional do AutoStand.
            </p>
          </div>

          <div className="space-y-5">
            <Field label="Email" error={errors.email?.message as string}>
              <input
                {...register('email')}
                type="email"
                placeholder="admin@autostand.local"
                className={inputClass}
              />
            </Field>

            <Field
              label="Palavra-passe"
              error={errors.password?.message as string}
            >
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className={inputClass}
              />
            </Field>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full py-3"
            >
              Entrar
            </Button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            {isOfflineMode()
              ? 'Modo offline ativo: escolhe um perfil de teste abaixo.'
              : 'A autenticação usa POST /auth/login e GET /auth/me.'}
          </p>

          {isOfflineMode() && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Credenciais de teste
              </div>
              <div className="space-y-2">
                {OFFLINE_CREDENTIALS.map((credential) => (
                  <button
                    key={credential.email}
                    type="button"
                    onClick={() => {
                      setError('');
                      setValue('email', credential.email, {
                        shouldValidate: true,
                      });
                      setValue('password', credential.password, {
                        shouldValidate: true,
                      });
                    }}
                    className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-red-300 hover:bg-red-50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-slate-800">
                        {credential.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        {credential.role}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {credential.email} · {credential.password}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
