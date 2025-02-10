import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import logger from '../utils/logger';

interface AuthenticatedRequest extends Request {
    userId?: string; // Or however you want to identify the user
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>

        jwt.verify(token, config.jwtSecret, (err, user) => {
            if (err) {
                logger.warn(`JWT Verification Failed for token: ${token} - ${err.message}`);
                return res.sendStatus(403); // Forbidden - invalid token
            }

            (req as AuthenticatedRequest).userId = (user as { userId: string }).userId; // Attach user info to request
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized - no token
    }
};