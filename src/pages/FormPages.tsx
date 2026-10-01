import type { FormEventHandler, ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';
import { z } from 'zod';
import { Button } from '../components/Button';
import { Field, inputClass } from '../components/Field';
import { PageHeader } from '../components/PageHeader';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';
import {
  vehicleSchema,
  clientSchema,
  standSchema,
  processSchema,
  paymentSchema,
  installmentSchema,
  returnSchema,
  transferSchema,
  userSchema,
} from '../schemas/forms';
import { vehiclesApi } from '../api/vehicles.api';
import { clientsApi } from '../api/clients.api';
import { standsApi } from '../api/stands.api';
import { processesApi } from '../api/processes.api';
import { paymentsApi } from '../api/payments.api';
import { installmentsApi } from '../api/installments.api';
import { rentalReturnsApi } from '../api/rental-returns.api';
import { transfersApi } from '../api/transfers.api';
import { usersApi } from '../api/users.api';

type VehicleForm = z.infer<typeof vehicleSchema>;
type ClientForm = z.infer<typeof clientSchema>;
type StandForm = z.infer<typeof standSchema>;
type ProcessForm = z.infer<typeof processSchema>;
type PaymentForm = z.infer<typeof paymentSchema>;
type InstallmentForm = z.infer<typeof installmentSchema>;
type ReturnForm = z.infer<typeof returnSchema>;
type TransferForm = z.infer<typeof transferSchema>;
type UserForm = z.infer<typeof userSchema>;

type ToastApi = ReturnType<typeof useToast>;

type FormShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  loading: boolean;
  toast: ToastApi;
};

function FormShell({ title, subtitle, children, onSubmit, loading, toast }: FormShellProps) {
  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
        }
      />

      <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">{children}</div>
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
          <Button type="submit" loading={loading}>
            <Save size={16} /> Guardar
          </Button>
        </div>
      </form>

      {toast.toast && (
        <Toast message={toast.toast.message} type={toast.toast.type} onClose={toast.clear} />
      )}
    </>
  );
}

type InputProps = {
  reg: UseFormRegisterReturn;
  error?: string;
  type?: string;
  placeholder?: string;
};

function Input({ reg, error, type = 'text', placeholder }: InputProps) {
  return (
    <div>
      <input {...reg} type={type} placeholder={placeholder} className={inputClass} />
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  );
}

export function VehicleFormPage() {
  const nav = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const edit = Boolean(id);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VehicleForm>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { status: 'AVAILABLE' },
  });

  const submit = async (data: VehicleForm) => {
    try {
      if (edit) await vehiclesApi.update(Number(id), data);
      else await vehiclesApi.create({ ...data, status: 'AVAILABLE' });
      toast.success(edit ? 'Veículo atualizado com sucesso.' : 'Veículo criado com sucesso.');
      window.setTimeout(() => nav('/vehicles'), 300);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível guardar o veículo.');
    }
  };

  return (
    <FormShell
      title={edit ? 'Editar veículo' : 'Novo veículo'}
      subtitle="Dados de inventário e operação"
      onSubmit={handleSubmit(submit)}
      loading={isSubmitting}
      toast={toast}
    >
      <Field label="Stand" error={errors.standId?.message as string | undefined}>
        <Input reg={register('standId')} type="number" placeholder="1" />
      </Field>
      <Field label="Marca" error={errors.brand?.message as string | undefined}>
        <Input reg={register('brand')} placeholder="Toyota" />
      </Field>
      <Field label="Modelo" error={errors.model?.message as string | undefined}>
        <Input reg={register('model')} placeholder="Hilux" />
      </Field>
      <Field label="Ano" error={errors.year?.message as string | undefined}>
        <Input reg={register('year')} type="number" placeholder="2024" />
      </Field>
      <Field label="Matrícula" error={errors.plate?.message as string | undefined}>
        <Input reg={register('plate')} placeholder="LD-45-23-AB" />
      </Field>
      <Field label="VIN" error={errors.vin?.message as string | undefined}>
        <Input reg={register('vin')} placeholder="XXXXXXXX" />
      </Field>
      <Field label="Cor">
        <Input reg={register('color')} placeholder="Preto" />
      </Field>
      <Field label="Combustível">
        <select {...register('fuel')} className={inputClass}>
          <option value="">Selecionar</option>
          <option value="DIESEL">Diesel</option>
          <option value="GASOLINE">Gasolina</option>
          <option value="HYBRID">Híbrido</option>
          <option value="ELECTRIC">Elétrico</option>
        </select>
      </Field>
      <Field label="Transmissão">
        <select {...register('transmission')} className={inputClass}>
          <option value="">Selecionar</option>
          <option value="AUTOMATIC">Automática</option>
          <option value="MANUAL">Manual</option>
        </select>
      </Field>
      <Field label="Quilometragem">
        <Input reg={register('mileage')} type="number" placeholder="15000" />
      </Field>
      <Field label="Preço de venda">
        <Input reg={register('salePrice')} type="number" placeholder="35000000" />
      </Field>
      <Field label="Preço diário de aluguer">
        <Input reg={register('rentalDailyRate')} type="number" placeholder="150000" />
      </Field>
      <Field label="Descrição">
        <textarea {...register('description')} className={`${inputClass} min-h-24`} placeholder="Descrição do veículo..." />
      </Field>
    </FormShell>
  );
}

export function ClientFormPage() {
  const nav = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientForm>({ resolver: zodResolver(clientSchema) });

  const submit = async (data: ClientForm) => {
    try {
      await clientsApi.create(data);
      toast.success('Cliente criado com sucesso.');
      window.setTimeout(() => nav('/clients'), 300);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível criar o cliente.');
    }
  };

  return (
    <FormShell title="Novo cliente" subtitle="Regista os dados do cliente" onSubmit={handleSubmit(submit)} loading={isSubmitting} toast={toast}>
      <Field label="Nome" error={errors.name?.message as string | undefined}>
        <Input reg={register('name')} placeholder="João Manuel" />
      </Field>
      <Field label="Telefone" error={errors.phone?.message as string | undefined}>
        <Input reg={register('phone')} placeholder="923000000" />
      </Field>
      <Field label="Email" error={errors.email?.message as string | undefined}>
        <Input reg={register('email')} type="email" placeholder="joao@email.com" />
      </Field>
      <Field label="Documento" error={errors.document?.message as string | undefined}>
        <Input reg={register('document')} placeholder="000000000LA000" />
      </Field>
      <Field label="Endereço">
        <Input reg={register('address')} placeholder="Talatona" />
      </Field>
    </FormShell>
  );
}

export function StandFormPage() {
  const nav = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StandForm>({ resolver: zodResolver(standSchema) });

  const submit = async (data: StandForm) => {
    try {
      await standsApi.create({ ...data, parentStandId: data.parentStandId || null });
      toast.success('Stand criado com sucesso.');
      window.setTimeout(() => nav('/stands'), 300);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível criar o stand.');
    }
  };

  return (
    <FormShell title="Novo stand" subtitle="Cria um stand principal ou substand" onSubmit={handleSubmit(submit)} loading={isSubmitting} toast={toast}>
      <Field label="Nome" error={errors.name?.message as string | undefined}>
        <Input reg={register('name')} placeholder="AutoStand Talatona" />
      </Field>
      <Field label="Código" error={errors.code?.message as string | undefined}>
        <Input reg={register('code')} placeholder="TAL-001" />
      </Field>
      <Field label="Telefone">
        <Input reg={register('phone')} placeholder="923000000" />
      </Field>
      <Field label="Endereço">
        <Input reg={register('address')} placeholder="Talatona" />
      </Field>
      <Field label="ID do stand pai">
        <Input reg={register('parentStandId')} type="number" placeholder="Vazio para stand principal" />
      </Field>
    </FormShell>
  );
}

export function ProcessFormPage() {
  const nav = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProcessForm>({ resolver: zodResolver(processSchema) });

  const submit = async (data: ProcessForm) => {
    try {
      await processesApi.create(data);
      toast.success('Processo criado com sucesso.');
      window.setTimeout(() => nav('/processes'), 300);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível criar o processo.');
    }
  };

  return (
    <FormShell title="Novo processo" subtitle="Inicia uma operação de venda ou aluguer" onSubmit={handleSubmit(submit)} loading={isSubmitting} toast={toast}>
      <Field label="Veículo" error={errors.vehicleId?.message as string | undefined}>
        <Input reg={register('vehicleId')} type="number" placeholder="15" />
      </Field>
      <Field label="Cliente" error={errors.clientId?.message as string | undefined}>
        <Input reg={register('clientId')} type="number" placeholder="5" />
      </Field>
      <Field label="Stand" error={errors.standId?.message as string | undefined}>
        <Input reg={register('standId')} type="number" placeholder="1" />
      </Field>
      <Field label="Gestor" error={errors.managerId?.message as string | undefined}>
        <Input reg={register('managerId')} type="number" placeholder="3" />
      </Field>
      <Field label="Tipo" error={errors.type?.message as string | undefined}>
        <select {...register('type')} className={inputClass}>
          <option value="SALE">Venda</option>
          <option value="RENTAL">Aluguer</option>
        </select>
      </Field>
      <Field label="Notas">
        <textarea {...register('notes')} className={`${inputClass} min-h-24`} />
      </Field>
    </FormShell>
  );
}

export function PaymentFormPage() {
  const nav = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentForm>({ resolver: zodResolver(paymentSchema) });

  const submit = async (data: PaymentForm) => {
    try {
      await paymentsApi.create({
        ...data,
        ...(data.installmentId === undefined ? {} : { installmentId: data.installmentId }),
      });
      toast.success('Pagamento registado com sucesso.');
      window.setTimeout(() => nav('/payments'), 300);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível registar o pagamento.');
    }
  };

  return (
    <FormShell title="Registar pagamento" subtitle="A API calcula o estado financeiro" onSubmit={handleSubmit(submit)} loading={isSubmitting} toast={toast}>
      <Field label="Contrato" error={errors.contractId?.message as string | undefined}>
        <Input reg={register('contractId')} type="number" placeholder="10" />
      </Field>
      <Field label="Prestação">
        <Input reg={register('installmentId')} type="number" placeholder="3" />
      </Field>
      <Field label="Valor" error={errors.amount?.message as string | undefined}>
        <Input reg={register('amount')} type="number" placeholder="1000000" />
      </Field>
      <Field label="Método" error={errors.method?.message as string | undefined}>
        <select {...register('method')} className={inputClass}>
          <option value="CASH">Numerário</option>
          <option value="TRANSFER">Transferência</option>
          <option value="POS">POS</option>
          <option value="OTHER">Outro</option>
        </select>
      </Field>
      <Field label="Referência">
        <Input reg={register('reference')} placeholder="TRX-123456" />
      </Field>
      <Field label="Notas">
        <textarea {...register('notes')} className={`${inputClass} min-h-24`} />
      </Field>
    </FormShell>
  );
}

export function InstallmentFormPage() {
  const nav = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InstallmentForm>({ resolver: zodResolver(installmentSchema) });

  const submit = async (data: InstallmentForm) => {
    try {
      await installmentsApi.create(data);
      toast.success('Prestação criada com sucesso.');
      window.setTimeout(() => nav('/installments'), 300);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível criar a prestação.');
    }
  };

  return (
    <FormShell title="Nova prestação" subtitle="Adiciona uma prestação ao contrato" onSubmit={handleSubmit(submit)} loading={isSubmitting} toast={toast}>
      <Field label="Contrato">
        <Input reg={register('contractId')} type="number" />
      </Field>
      <Field label="Nº">
        <Input reg={register('number')} type="number" />
      </Field>
      <Field label="Vencimento">
        <Input reg={register('dueDate')} type="date" />
      </Field>
      <Field label="Valor">
        <Input reg={register('amount')} type="number" />
      </Field>
    </FormShell>
  );
}

export function ReturnFormPage() {
  const nav = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ReturnForm>({ resolver: zodResolver(returnSchema) });

  const submit = async (data: ReturnForm) => {
    try {
      await rentalReturnsApi.create(data);
      toast.success('Devolução registada com sucesso.');
      window.setTimeout(() => nav('/rental-returns'), 300);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível registar a devolução.');
    }
  };

  return (
    <FormShell title="Registar devolução" subtitle="A API atualiza o estado do veículo" onSubmit={handleSubmit(submit)} loading={isSubmitting} toast={toast}>
      <Field label="Contrato">
        <Input reg={register('contractId')} type="number" />
      </Field>
      <Field label="Veículo">
        <Input reg={register('vehicleId')} type="number" />
      </Field>
      <Field label="Quilometragem">
        <Input reg={register('mileage')} type="number" />
      </Field>
      <Field label="Condição">
        <Input reg={register('condition')} placeholder="GOOD" />
      </Field>
      <Field label="Danos">
        <textarea {...register('damages')} className={`${inputClass} min-h-24`} />
      </Field>
      <Field label="Notas">
        <textarea {...register('notes')} className={`${inputClass} min-h-24`} />
      </Field>
    </FormShell>
  );
}

export function TransferFormPage() {
  const nav = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const ownStandId = user?.role === 'MINI_ADMIN' ? user.standIds[0] : undefined;
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: ownStandId ? { fromStandId: ownStandId } : undefined,
  });

  const submit = async (data: TransferForm) => {
    try {
      await transfersApi.create({ ...data, ...(ownStandId ? { fromStandId: ownStandId } : {}) });
      toast.success('Transferência solicitada com sucesso.');
      window.setTimeout(() => nav('/transfers'), 300);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível solicitar a transferência.');
    }
  };

  return (
    <FormShell title="Nova transferência" subtitle="Solicita a movimentação de um veículo entre stands" onSubmit={handleSubmit(submit)} loading={isSubmitting} toast={toast}>
      <Field label="Veículo">
        <Input reg={register('vehicleId')} type="number" />
      </Field>
      <Field label="Stand de origem">
        <Input reg={register('fromStandId')} type="number" placeholder={ownStandId ? String(ownStandId) : 'ID do stand'} />
        {ownStandId && <p className="mt-1 text-xs text-slate-400">A origem fica limitada à tua substand.</p>}
      </Field>
      <Field label="Stand de destino">
        <Input reg={register('toStandId')} type="number" />
      </Field>
      <Field label="Notas">
        <textarea {...register('notes')} className={`${inputClass} min-h-24`} />
      </Field>
    </FormShell>
  );
}

export function UserFormPage() {
  const nav = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { role: 'GESTOR', standIds: [] },
  });

  const submit = async (data: UserForm) => {
    try {
      await usersApi.create({ ...data, standIds: data.standIds ?? [] });
      toast.success('Utilizador criado com sucesso.');
      window.setTimeout(() => nav('/users'), 300);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível criar o utilizador.');
    }
  };

  return (
    <FormShell title="Novo utilizador" subtitle="Define cargo e stands associados" onSubmit={handleSubmit(submit)} loading={isSubmitting} toast={toast}>
      <Field label="Nome">
        <Input reg={register('name')} />
      </Field>
      <Field label="Email">
        <Input reg={register('email')} type="email" />
      </Field>
      <Field label="Telefone">
        <Input reg={register('phone')} />
      </Field>
      <Field label="Palavra-passe">
        <Input reg={register('password')} type="password" />
      </Field>
      <Field label="Cargo">
        <select {...register('role')} className={inputClass}>
          <option value="ADMIN_GLOBAL">ADMIN_GLOBAL</option>
          <option value="MINI_ADMIN">MINI_ADMIN</option>
          <option value="GESTOR">GESTOR</option>
          <option value="CLIENTE">CLIENTE</option>
        </select>
      </Field>
      <Field label="Stand ID">
        <Input reg={register('standIds.0')} type="number" placeholder="1" />
      </Field>
    </FormShell>
  );
}
