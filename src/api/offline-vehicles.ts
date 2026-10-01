import type { Vehicle } from '../types/domain';

function photo(label: string, tone: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="#f8fafc"/><rect x="40" y="40" width="720" height="420" rx="28" fill="${tone}"/><path d="M180 320h440l45 50H135l45-50Zm55-18 52-100c8-15 22-24 39-24h108c18 0 34 10 42 26l50 98H235Z" fill="#0f172a"/><circle cx="245" cy="382" r="34" fill="#334155"/><circle cx="555" cy="382" r="34" fill="#334155"/><rect x="310" y="205" width="90" height="55" rx="10" fill="#cbd5e1"/><rect x="408" y="205" width="92" height="55" rx="10" fill="#cbd5e1"/><text x="400" y="120" text-anchor="middle" font-family="Arial" font-size="28" font-weight="700" fill="#0f172a">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function photos(label: string, tone: string) {
  return Array.from({ length: 8 }, (_, index) => photo(`${label} · Foto ${index + 1}`, tone));
}

export const OFFLINE_VEHICLES: Vehicle[] = [
  { id: 101, standId: 1, brand: 'Toyota', model: 'Hilux', year: 2024, plate: 'LD-45-23-AB', vin: 'AUTOHILUX2024DEMO01', color: 'Preto', fuel: 'DIESEL', transmission: 'AUTOMATIC', mileage: 15000, salePrice: 35000000, rentalDailyRate: 150000, status: 'AVAILABLE', description: 'Toyota Hilux em excelente estado, pronta para venda.', photos: photos('Toyota Hilux', '#fee2e2'), stand: { id: 1, name: 'AutoStand Principal' } },
  { id: 102, standId: 2, brand: 'Hyundai', model: 'Tucson', year: 2023, plate: 'LD-72-10-CD', vin: 'AUTOTUCSON2023DEMO02', color: 'Branco', fuel: 'GASOLINE', transmission: 'AUTOMATIC', mileage: 22000, salePrice: 28500000, rentalDailyRate: 120000, status: 'AVAILABLE', description: 'SUV confortável e versátil, disponível na Revendedora Talatona.', photos: photos('Hyundai Tucson', '#e0e7ff'), stand: { id: 2, name: 'Revendedora Talatona' } },
  { id: 103, standId: 3, brand: 'Kia', model: 'Sportage', year: 2024, plate: 'LD-81-34-EF', vin: 'AUTOSPORTAGE2024DEMO03', color: 'Cinza', fuel: 'HYBRID', transmission: 'AUTOMATIC', mileage: 9000, salePrice: 32500000, rentalDailyRate: 135000, status: 'AVAILABLE', description: 'Kia Sportage híbrido com baixo quilometragem.', photos: photos('Kia Sportage', '#dcfce7'), stand: { id: 3, name: 'Revendedora Viana' } },
];

export function offlineVehicleList(): { data: Vehicle[]; total: number } {
  return { data: OFFLINE_VEHICLES, total: OFFLINE_VEHICLES.length };
}

export function offlineVehicle(id: number): Vehicle {
  const vehicle = OFFLINE_VEHICLES.find((item) => item.id === id);
  if (!vehicle) throw new Error('Veículo não encontrado.');
  return vehicle;
}
