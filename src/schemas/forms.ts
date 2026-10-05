import { z } from 'zod';
export const vehicleSchema = z.object({
  standId: z.coerce.number().positive(),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().min(1900).max(2100),
  plate: z.string().min(3),
  vin: z.string().min(6),
  color: z.string().optional(),
  fuel: z.string().optional(),
  transmission: z.string().optional(),
  mileage: z.coerce.number().min(0).optional(),
  salePrice: z.coerce.number().min(0).optional(),
  rentalDailyRate: z.coerce.number().min(0).optional(),
  status: z.enum([
    'AVAILABLE',
    'PROCESSING',
    'SOLD',
    'RENTED',
    'MAINTENANCE',
    'TRANSFER_PENDING',
    'INACTIVE',
  ]),
  description: z.string().optional(),
});
export const clientSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal('')),
  document: z.string().min(3),
  address: z.string().optional(),
});
export const standSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  parentStandId: z
    .union([z.coerce.number().positive(), z.literal('')])
    .optional(),
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export const processSchema = z.object({
  vehicleId: z.coerce.number().positive(),
  clientId: z.coerce.number().positive(),
  standId: z.coerce.number().positive(),
  managerId: z.coerce.number().positive(),
  type: z.enum(['SALE', 'RENTAL']),
  notes: z.string().optional(),
});
export const paymentSchema = z.object({
  contractId: z.coerce.number().positive(),
  installmentId: z.preprocess(
    (value) =>
      value === '' || value === undefined || value === null
        ? undefined
        : Number(value),
    z.number().positive().optional()
  ),
  amount: z.coerce.number().positive(),
  method: z.enum(['CASH', 'TRANSFER', 'POS', 'OTHER']),
  reference: z.string().optional(),
  notes: z.string().optional(),
});
export const installmentSchema = z.object({
  contractId: z.coerce.number().positive(),
  number: z.coerce.number().positive(),
  dueDate: z.string().min(1),
  amount: z.coerce.number().positive(),
});
export const transferSchema = z.object({
  vehicleId: z.coerce.number().positive(),
  fromStandId: z.coerce.number().positive(),
  toStandId: z.coerce.number().positive(),
  notes: z.string().optional(),
});
export const returnSchema = z.object({
  contractId: z.coerce.number().positive(),
  vehicleId: z.coerce.number().positive(),
  mileage: z.coerce.number().min(0),
  condition: z.string().min(2),
  damages: z.string().optional(),
  notes: z.string().optional(),
});
export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(['ADMIN_GLOBAL', 'MINI_ADMIN', 'GESTOR', 'CLIENTE']),
  standIds: z.array(z.coerce.number()).default([]),
});
