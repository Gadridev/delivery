import { Request, Response, NextFunction } from 'express';
import * as deliveryService from '../services/delivery.service';

export const getAllDeliveries = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deliveries = await deliveryService.getDeliveries();
    res.status(200).json(deliveries);
  } catch (error) {
    next(error);
  }
};

export const getDeliveryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const delivery = await deliveryService.getDeliveryById(id as string);

    if (!delivery) {
      res.status(404).json({ success: false, message: 'Delivery not found' });
      return;
    }

    res.status(200).json(delivery);
  } catch (error) {
    next(error);
  }
};

export const createDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recipientName, address } = req.body;

    if (!recipientName || recipientName.trim().length < 3) {
      res.status(400).json({
        success: false,
        message: 'Recipient name is required and must be at least 3 characters',
      });
      return;
    }

    if (!address || address.trim().length < 5) {
      res.status(400).json({
        success: false,
        message: 'Address is required and must be at least 5 characters',
      });
      return;
    }

    const newDelivery = await deliveryService.createDelivery({
      recipientName,
      address,
    });

    res.status(201).json(newDelivery);
  } catch (error) {
    next(error);
  }
};

export const updateDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { recipientName, address } = req.body;

    if (recipientName && recipientName.trim().length < 3) {
      res.status(400).json({
        success: false,
        message: 'Recipient name must be at least 3 characters',
      });
      return;
    }

    if (address && address.trim().length < 5) {
      res.status(400).json({
        success: false,
        message: 'Address must be at least 5 characters',
      });
      return;
    }

    const updatedDelivery = await deliveryService.updateDelivery(id as string, {
      recipientName,
      address,
    });

    if (!updatedDelivery) {
      res.status(404).json({
        success: false,
        message: 'Delivery not found or already delivered',
      });
      return;
    }

    res.status(200).json(updatedDelivery);
  } catch (error) {
    next(error);
  }
};

export const confirmDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const confirmed = await deliveryService.confirmDelivery(id as string);

    if (!confirmed) {
      res.status(404).json({
        success: false,
        message: 'Delivery not found or already delivered',
      });
      return;
    }

    res.status(200).json(confirmed);
  } catch (error) {
    next(error);
  }
};

export const deleteDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await deliveryService.deleteDelivery(id as string);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Delivery not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Delivery deleted successfully' });
  } catch (error) {
    next(error);
  }
};