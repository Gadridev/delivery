import 'dotenv/config';
import app from './app';
import { connectDatabase } from './config/database';

const port = Number(process.env.PORT);

const startServer = async (): Promise<void> => {
	await connectDatabase();

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
};

startServer().catch((error: unknown) => {
	console.error('Failed to start server', error);
	process.exit(1);
});
