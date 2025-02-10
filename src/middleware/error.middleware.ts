import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { CustomError } from '../utils/customError';
import logger from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error('ERROR HANDLER:', err);

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ message: err.message, errors: err.errors });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    }

    if (err instanceof Error) { // Generic error handling
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }

    // Default error handler if error type is not recognized
    return res.status(500).json({ message: 'An unexpected error occurred' });
};