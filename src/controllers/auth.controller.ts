import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { z } from 'zod';
import { CustomError } from '../utils/customError';
import bcrypt from 'bcrypt';

// In-memory user storage (replace with database in real app)
const users = [{ id: 'user1', username: 'imf_agent', hashedPassword: '$2b$10$fakeHashedPass123' }]; // Example with a fake hashed password

const registrationSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = registrationSchema.parse(req.body);
        const { username, password } = validatedData;

        const usernameExists = users.some(user => user.username === username);
        if (usernameExists) {
            throw new CustomError(409, 'Username already taken');
        }

        // 1. Hash the password using bcrypt
        const saltRounds = 10; // Recommended salt rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 2. Store username and *hashed* password (in a real app, to database)
        const newUser = { id: `user${users.length + 1}`, username, hashedPassword };
        users.push(newUser);

        const token = jwt.sign({ userId: newUser.id }, config.jwtSecret, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            next(new CustomError(400, 'Validation failed', error.errors));
        } else if (error instanceof CustomError) {
            next(error);
        } else {
            next(new CustomError(500, 'Registration failed'));
        }
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

    if (!user) {
        return next(new CustomError(401, 'Invalid credentials')); // User not found
    }

    // 1. Compare entered password with *hashed* password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (passwordMatch) {
        const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } else {
        next(new CustomError(401, 'Invalid credentials')); // Password does not match
    }
};