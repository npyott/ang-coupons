import { ID, Prefix } from "ang-coupons-2023";
import { randomUUID } from "crypto";

export type ExtractTypedKeys<T, S> = {
    [K in keyof T as T[K] extends S ? K : never]: T[K];
};

export const itMap = function* <T, R>(
    it: Iterable<T>,
    map: (value: T, index: number) => R
) {
    let index = 0;
    for (const x of it) {
        yield map(x, index);
        ++index;
    }
};

export const range = (start: number, end: number, increment = 1) => {
    const array = new Array<number>();
    for (let i = start; i < end; i += increment) {
        array.push(i);
    }

    return array;
};

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const generateID = <P extends Prefix>(prefix: P): ID<P> => {
    const uuid = randomUUID();

    return `${prefix}+${uuid}`;
};

// From a positive integer, produces a string
// A, B, C, ..., AA, AB, AC, ...
export const alphabetNumber = (n: number): string => {
    n = Math.max(Math.floor(n), 0);
    if (n <= 0) {
        return "";
    }

    const remainder = Math.floor(n % 26);
    const quotient = Math.floor(n / 26);
    const digit = alphabet[remainder];
    return `${alphabetNumber(quotient)}${digit}`;
};
