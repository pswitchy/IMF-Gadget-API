
// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import gadgetRoutes from './routes/gadget.routes';
import authRoutes from './routes/auth.routes';
import { authenticateJWT } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.use('/auth', authRoutes);
app.use('/gadgets', authenticateJWT, gadgetRoutes);

app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('OK');
});

// Make sure errorHandler is defined with the correct type signature
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

export default app;