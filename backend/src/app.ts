import express, { Application } from 'express';
import cors from 'cors';
import deliveryRoutes from './routes/delivery.routes';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/deliveries', deliveryRoutes);

app.use(errorHandler);

export default app;