import { Delivery, IDelivery } from "../models/delivery.model";
import { AppError } from "../middleware/error.middleware";


export interface CreateDeliveryData {
  recipientName: string;
  address: string;
}

export interface UpdateDeliveryData {
  recipientName: string;
  address: string;
}


export async function getAllDeliveries(): Promise<IDelivery[]> {

  return Delivery.find();
}

// GET /api/deliveries/:id
export async function getDeliveryById(id: string): Promise<IDelivery> {
  const delivery = await Delivery.findById(id);

  if (!delivery) {
    throw new AppError("Delivery not found", 404);
  }

  return delivery;
}

// POST /api/deliveries
// status and confirmedAt are set automatically - the client cannot choose them.
export async function createDelivery(data: CreateDeliveryData): Promise<IDelivery> {
  const delivery = await Delivery.create({
    recipientName: data.recipientName,
    address: data.address,
    status: "pending",
    confirmedAt: null,
  });

  return delivery;
}

// PUT /api/deliveries/:id
// Only recipientName and address can be changed here. A delivered delivery
// cannot be edited at all.
export async function updateDelivery(
  id: string,
  data: UpdateDeliveryData
): Promise<IDelivery> {
  const delivery = await Delivery.findById(id);

  if (!delivery) {
    throw new AppError("Delivery not found", 404);
  }

  if (delivery.status === "delivered") {
    throw new AppError("Delivered delivery cannot be edited", 400);
  }

  delivery.recipientName = data.recipientName;
  delivery.address = data.address;
  await delivery.save();

  return delivery;
}

// PATCH /api/deliveries/:id/confirm
// The only place where a delivery can move from "pending" to "delivered".
export async function confirmDelivery(id: string): Promise<IDelivery> {
  const delivery = await Delivery.findById(id);

  if (!delivery) {
    throw new AppError("Delivery not found", 404);
  }

  if (delivery.status === "delivered") {
    throw new AppError("Delivery is already delivered", 400);
  }

  delivery.status = "delivered";
  delivery.confirmedAt = new Date();
  await delivery.save();

  return delivery;
}

// DELETE /api/deliveries/:id
export async function deleteDelivery(id: string): Promise<void> {
  const delivery = await Delivery.findById(id);

  if (!delivery) {
    throw new AppError("Delivery not found", 404);
  }

  await delivery.deleteOne();
}
