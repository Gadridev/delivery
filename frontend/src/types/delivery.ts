export type DeliveryStatus = 'pending' | 'delivered';

export interface IDelivery {
  _id: string;
  recipientName: string;
  address: string;
  status: DeliveryStatus;
  confirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryDTO {
  recipientName: string;
  address: string;
}

export interface UpdateDeliveryDTO {
  recipientName?: string;
  address?: string;
  status?: DeliveryStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export type FilterStatus = 'all' | 'pending' | 'delivered';

export interface DeliveryConfirmationHistoryItem {
  deliveryId: string;
  recipientName: string;
  address: string;
  confirmedAt: string;
}

export type RootStackParamList = {
  DeliveryList: undefined;
  DeliveryDetail: { id: string };
  CreateDelivery: undefined;
  EditDelivery: { id: string; delivery: IDelivery };
  Settings: undefined;
};
