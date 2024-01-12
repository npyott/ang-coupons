import { randomUUID } from "crypto";

export const generateID = (prefix: string) => {
    const uuid = randomUUID();

    return `${prefix}-${uuid}`;
};
