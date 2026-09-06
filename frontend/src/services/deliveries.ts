import axios, { AxiosError } from 'axios';
import {
  IDelivery,
  CreateDeliveryDTO,
  UpdateDeliveryDTO,
  ApiResponse,
} from '../types/delivery';
import { getApiUrl } from '../config/api';

const getClient = () => {
  return axios.create({
    baseURL: getApiUrl(),
    timeout: 8000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.message || error.response?.data?.error;
    if (serverMessage) return serverMessage;
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return 'Délai d’attente dépassé. Vérifiez la connexion.';
    }
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return 'Impossible de joindre le serveur API.';
    }
    return `Erreur serveur (${error.response?.status || 'inconnue'})`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Une erreur inattendue est survenue.';
};

/**
 * GET /api/deliveries
 */
export const getAllDeliveries = async (): Promise<IDelivery[]> => {
  try {
    const client = getClient();
    const response = await client.get<ApiResponse<IDelivery[]>>('/deliveries');
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * GET /api/deliveries/:id
 */
export const getDeliveryById = async (id: string): Promise<IDelivery> => {
  try {
    const client = getClient();
    const response = await client.get<ApiResponse<IDelivery>>(`/deliveries/${id}`);
    if (response.data && response.data.data) {
      return response.data.data;
    }
    throw new Error('Livraison introuvable');
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * POST /api/deliveries
 */
export const createDelivery = async (
  data: CreateDeliveryDTO
): Promise<IDelivery> => {
  try {
    const client = getClient();
    const response = await client.post<ApiResponse<IDelivery>>('/deliveries', data);
    if (response.data && response.data.data) {
      return response.data.data;
    }
    throw new Error('Échec de la création de la livraison');
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * PUT /api/deliveries/:id
 */
export const updateDelivery = async (
  id: string,
  data: UpdateDeliveryDTO
): Promise<IDelivery> => {
  try {
    const client = getClient();
    const response = await client.put<ApiResponse<IDelivery>>(
      `/deliveries/${id}`,
      data
    );
    if (response.data && response.data.data) {
      return response.data.data;
    }
    throw new Error('Échec de la mise à jour de la livraison');
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * PATCH /api/deliveries/:id/confirm
 */
export const confirmDelivery = async (id: string): Promise<IDelivery> => {
  try {
    const client = getClient();
    const response = await client.patch<ApiResponse<IDelivery>>(
      `/deliveries/${id}/confirm`
    );
    if (response.data && response.data.data) {
      return response.data.data;
    }
    throw new Error('Échec de la confirmation de la livraison');
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * DELETE /api/deliveries/:id
 */
export const deleteDelivery = async (id: string): Promise<void> => {
  try {
    const client = getClient();
    await client.delete<ApiResponse<null>>(`/deliveries/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
