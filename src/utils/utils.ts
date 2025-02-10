import { v4 as uuidv4 } from 'uuid';

const gadgetPrefixes = ["The", "Project", "Operation", "Device"];
const gadgetNames = ["Nightingale", "Kraken", "Spectre", "Phoenix", "Wraith", "Chimera", "Hydra", "Griffin"];

export const generateCodename = (): string => {
    const prefix = gadgetPrefixes[Math.floor(Math.random() * gadgetPrefixes.length)];
    const name = gadgetNames[Math.floor(Math.random() * gadgetNames.length)];
    return `${prefix} ${name}`;
};

export const generateSuccessProbability = (): number => {
    return Math.floor(Math.random() * (95 - 60 + 1)) + 60; // Random between 60% and 95%
};

export const generateConfirmationCode = (): string => {
    return uuidv4().substring(0, 8).toUpperCase(); // 8-character random code
};