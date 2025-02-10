import { PrismaClient, Prisma } from '@prisma/client'; // Import Prisma namespace
import { generateCodename } from '../utils/utils';

const prisma = new PrismaClient();

export const getAllGadgets = async (status?: 'Active' | 'Inactive' | 'Decommissioned') => {
    return prisma.gadget.findMany({
        where: status ? {
            status: status as Prisma.GadgetCreateInput['status']
        } : {},
    });
};

export const createGadget = async (name: string) => {
    const codename = name || generateCodename();
    return prisma.gadget.create({
        data: {
            name: codename,
        },
    });
};

export const updateGadget = async (id: string, data: {
    name?: string,
    status?: 'Active' | 'Inactive' | 'Decommissioned'
}) => {
    return prisma.gadget.update({
        where: { id },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.status && { status: data.status as Prisma.GadgetCreateInput['status'] }),
        },
    });
};

export const decommissionGadget = async (id: string) => {
    return prisma.gadget.update({
        where: { id },
        data: {
            status: 'Decommissioned',
            decommissionedAt: new Date(),
        },
    });
};

export const getGadgetById = async (id: string) => {
    return prisma.gadget.findUnique({
        where: { id },
    });
};

export const isGadgetSelfDestructable = async (id: string): Promise<boolean> => {
    const gadget = await getGadgetById(id);
    return Boolean(gadget && (gadget.status === 'Available' || gadget.status === 'Deployed'));
};