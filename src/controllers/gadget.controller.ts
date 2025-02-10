import { Request, Response, NextFunction } from 'express';
import * as GadgetService from '../services/gadget.service';
import { generateSuccessProbability, generateConfirmationCode } from '../utils/utils';
import { z } from 'zod';
import { CustomError } from '../utils/customError';
import { GadgetWithProbability } from '../types/gadget.types';
import { GadgetStatus } from '@prisma/client';

// Define both external and internal status types
type ExternalStatus = 'Available' | 'Deployed' | 'Destroyed' | 'Decommissioned';
type InternalStatus = 'Active' | 'Inactive' | 'Decommissioned';

const gadgetSchema = z.object({
    name: z.string().min(3).max(255),
    status: z.enum(['Active', 'Inactive', 'Available', 'Deployed', 'Destroyed', 'Decommissioned']).optional(),
});

const gadgetUpdateSchema = z.object({
    name: z.string().min(3).max(255).optional(),
    status: z.enum(['Available', 'Deployed', 'Destroyed', 'Decommissioned']).optional(),
});

export const getGadgets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const status = req.query.status as InternalStatus | undefined;
        const gadgets = await GadgetService.getAllGadgets(status);
        const gadgetsWithProbability: GadgetWithProbability[] = gadgets.map((gadget) => ({
            ...gadget,
            missionSuccessProbability: `${generateSuccessProbability()}%`,
        }));
        res.json(gadgetsWithProbability);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const createGadget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = gadgetSchema.parse(req.body);
        const gadget = await GadgetService.createGadget(validatedData.name);
        res.status(201).json(gadget);
    } catch (error) {
        if (error instanceof z.ZodError) {
            next(new CustomError(400, 'Validation failed', error.errors));
        } else {
            next(new CustomError(500, 'Failed to create gadget'));
        }
    }
};

// export const updateGadget = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = req.params.id;
//         const validatedData = gadgetUpdateSchema.parse(req.body);
        
//         // Map external status to internal status
//         const internalStatus: InternalStatus | undefined = validatedData.status ? 
//             validatedData.status === 'Available' || validatedData.status === 'Deployed' ? 'Active' :
//             validatedData.status === 'Destroyed' ? 'Inactive' :
//             'Decommissioned'
//             : undefined;

//         const updatedGadget = await GadgetService.updateGadget(id, {
//             name: validatedData.name,
//             status: internalStatus
//         });

//         if (!updatedGadget) {
//             throw new CustomError(404, 'Gadget not found');
//         }
//         res.json(updatedGadget);
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             next(new CustomError(400, 'Validation failed', error.errors));
//         } else if (error instanceof CustomError) {
//             next(error);
//         } else {
//             next(new CustomError(500, 'Failed to update gadget'));
//         }
//     }
// };

export const deleteGadget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const decommissionedGadget = await GadgetService.decommissionGadget(id);
        if (!decommissionedGadget) {
            throw new CustomError(404, 'Gadget not found');
        }
        res.json({ message: 'Gadget decommissioned successfully', gadget: decommissionedGadget });
    } catch (error) {
        next(error);
    }
};

export const updateGadget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const validatedData = gadgetUpdateSchema.parse(req.body);
        
        // Validate that the gadget exists before updating
        const existingGadget = await GadgetService.getGadgetById(id);
        if (!existingGadget) {
            return next(new CustomError(404, 'Gadget not found'));
        }

        // Map external status to internal status
        const internalStatus: InternalStatus | undefined = validatedData.status ? 
            validatedData.status === 'Available' || validatedData.status === 'Deployed' ? 'Active' :
            validatedData.status === 'Destroyed' ? 'Inactive' :
            'Decommissioned'
            : undefined;

        const updatedGadget = await GadgetService.updateGadget(id, {
            name: validatedData.name,
            status: internalStatus
        });

        res.json(updatedGadget);
    } catch (error) {
        if (error instanceof z.ZodError) {
            next(new CustomError(400, 'Validation failed', error.errors));
        } else if (error instanceof CustomError) {
            next(error);
        } else {
            console.error('Unexpected error in updateGadget:', error);
            next(new CustomError(500, 'Failed to update gadget'));
        }
    }
};

export const selfDestructGadget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const gadget = await GadgetService.getGadgetById(id);
        if (!gadget) {
            return next(new CustomError(404, 'Gadget not found'));
        }

        // Ensure gadget is not already destroyed or decommissioned
        if (gadget.status === 'Destroyed' || gadget.status === 'Decommissioned') {
            return next(new CustomError(400, 'Gadget cannot be self-destructed'));
        }

        const confirmationCode = generateConfirmationCode();
        console.log(`Confirmation code for gadget ${id}: ${confirmationCode}`);

        // Update the gadget to inactive status
        const destroyedGadget = await GadgetService.updateGadget(id, { 
            status: 'Inactive' 
        });

        res.json({ 
            message: 'Self-destruct sequence initiated', 
            confirmationCode,
            gadget: destroyedGadget 
        });
    } catch (error) {
        console.error('Unexpected error in selfDestructGadget:', error);
        next(new CustomError(500, 'Failed to initiate self-destruct sequence'));
    }
};