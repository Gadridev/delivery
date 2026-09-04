import { Router } from 'express';
import {
  getAllDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  confirmDelivery,
  deleteDelivery,
} from '../controllers/delivery.controller';

const router = Router();

router.get('/', getAllDeliveries);
router.get('/:id', getDeliveryById);
router.post('/', createDelivery);
router.put('/:id', updateDelivery);
router.patch('/:id/confirm', confirmDelivery);
router.delete('/:id', deleteDelivery);

export default router;