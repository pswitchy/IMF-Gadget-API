import { Gadget } from '@prisma/client'; // Correct import for Gadget Model

export interface GadgetWithProbability extends Gadget {
    missionSuccessProbability: string;
}