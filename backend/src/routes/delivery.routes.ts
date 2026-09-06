import { Router } from 'express';
import {
  getAllDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  confirmDelivery,
  deleteDelivery,
} from '../controllers/delivery.controller';
import { createDeliverySchema, updateDeliverySchema } from '../validators/delivery.validator';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.get('/', getAllDeliveries);
router.get('/:id', getDeliveryById);
router.post('/', validate(createDeliverySchema),createDelivery);
router.put('/:id', validate(updateDeliverySchema), updateDelivery);
router.patch('/:id/confirm', confirmDelivery);
router.delete('/:id', deleteDelivery);

export default router;