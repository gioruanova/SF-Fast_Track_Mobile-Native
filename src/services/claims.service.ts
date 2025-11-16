import { apiClient } from './api';
import { ApiResponse } from './auth.service';

export interface Claim {
  company_id: number;
  company_name: string;
  reclamo_id: number;
  created_at: string;
  creador: string;
  reclamo_titulo: string;
  reclamo_detalle: string;
  nombre_especialidad: string;
  cliente_id: number;
  cliente_complete_name: string;
  cliente_dni: string;
  cliente_phone: string;
  cliente_email: string;
  cliente_direccion: string;
  cliente_lat: string;
  cliente_lng: string;
  reclamo_url: string | null;
  profesional: string;
  agenda_fecha: string;
  agenda_hora_desde: string;
  agenda_hora_hasta: string;
  reclamo_estado: 'ABIERTO' | 'EN PROCESO' | 'EN PAUSA' | 'CERRADO' | 'CANCELADO';
  reclamo_nota_cierre: string | null;
  reclamo_presupuesto: string | null;
  updated_at: string;
}

export async function getClaims(): Promise<ApiResponse<Claim[]>> {
  return apiClient.get<Claim[]>('/customersApi/reclamos/profesional');
}

export async function getClaimDetail(reclamoId: number): Promise<ApiResponse<Claim>> {
  return apiClient.get<Claim>(`/customersApi/reclamos/profesional/gestion/${reclamoId}`);
}

export async function updateClaim(
  reclamoId: number,
  data: Partial<Claim>
): Promise<ApiResponse<Claim>> {
  return apiClient.put<Claim>(`/customersApi/reclamos/profesional/gestion/${reclamoId}`, data);
}

