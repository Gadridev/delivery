import { Delivery, DeliveryDocument, DeliveryStatus } from '../models/delivery.model';

export interface DeliveryInput {
	recipientName: string;
	address: string;
	status?: DeliveryStatus;
}

export const getDeliveries = async (): Promise<DeliveryDocument[]> => {
	return Delivery.find().sort({ createdAt: -1 });
};

export const getDeliveryById = async (id: string): Promise<DeliveryDocument | null> => {
	return Delivery.findById(id);
};

export const createDelivery = async (data: DeliveryInput): Promise<DeliveryDocument> => {
	return Delivery.create({
		recipientName: data.recipientName,
		address: data.address,
		status: data.status ?? 'pending',
		confirmedAt: data.status === 'delivered' ? new Date() : null,
	});
};

export const updateDelivery = async (
	id: string,
	data: DeliveryInput,
): Promise<DeliveryDocument | null> => {
	return Delivery.findOneAndUpdate(
		{ _id: id, status: 'pending' },
		{
			recipientName: data.recipientName,
			address: data.address,
		},
		{ new: true, runValidators: true },
	);
};

export const confirmDelivery = async (id: string): Promise<DeliveryDocument | null> => {
	return Delivery.findOneAndUpdate(
		{ _id: id, status: 'pending' },
		{ status: 'delivered', confirmedAt: new Date() },
		{ new: true, runValidators: true },
	);
};

export const deleteDelivery = async (id: string): Promise<DeliveryDocument | null> => {
	return Delivery.findByIdAndDelete(id);
};
