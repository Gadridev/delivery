import { Request, Response, NextFunction } from "express";
import * as deliveryService from "../services/delivery.service";

// GET /api/deliveries
export async function getAllDeliveries(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const deliveries = await deliveryService.getAllDeliveries();
    res.status(200).json({
      success: true,
      data: deliveries,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/deliveries/:id
export async function getDeliveryById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const delivery = await deliveryService.getDeliveryById(req.params.id as string);

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/deliveries
export async function createDelivery(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    console.log('controller.createDelivery: req.body', req.body);
    const { recipientName, address } = req.body;
    console.log('controller.createDelivery: calling service.createDelivery');
    const delivery = await deliveryService.createDelivery({ recipientName, address });
    console.log('controller.createDelivery: service returned');

    res.status(201).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/deliveries/:id
export async function updateDelivery(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { recipientName, address } = req.body;
    const delivery = await deliveryService.updateDelivery(req.params.id as string, {
      recipientName,
      address,
    });

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/deliveries/:id/confirm
export async function confirmDelivery(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const delivery = await deliveryService.confirmDelivery(req.params.id as string);

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/deliveries/:id
export async function deleteDelivery(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await deliveryService.deleteDelivery(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Delivery deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
