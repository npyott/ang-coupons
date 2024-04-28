import { ID, Prefix, Resource } from "ang-coupons-types";

// ID validation
export const validID = <PrefixT extends Prefix>(x: string, prefix: PrefixT) => {
    if (x.startsWith(prefix + "-")) {
        return x as ID<typeof prefix>;
    }

    throw new TypeError();
};

export const oneOfValidID = <PrefixesT extends readonly Prefix[]>(
    x: string,
    prefixes: PrefixesT
): ID<PrefixesT[number]> => {
    for (const prefix of prefixes) {
        try {
            return validID(x, prefix);
        } catch (e) {}
    }

    throw new TypeError();
};

// Numerical validation
export const validNumber = (x: unknown) => {
    if (typeof x !== "number" || isNaN(x)) {
        throw TypeError();
    }

    return x;
};
export const validEqualNumber = (x: number, y: number) => {
    if (x === y) {
        return x;
    }

    throw TypeError();
};
export const validEqualWithinNumber = (
    x: number,
    y: number,
    epsilon = Number.EPSILON
) => {
    if (Math.abs(x - y) < epsilon) {
        return x;
    }

    throw TypeError();
};
export const validNumberWithinRange = (
    x: number,
    lower: number,
    upper: number
) => {
    if (lower <= x && x <= upper) {
        return x;
    }

    throw TypeError();
};
export const validNumberIntegral = (x: number) => {
    if (x === Math.round(x)) {
        return x;
    }

    throw new TypeError();
};

// String validation
export const validString = (x: unknown) => {
    if (typeof x === "string") {
        return x;
    }

    throw new TypeError();
};

export const validURL = (x: string) => {
    try {
        new URL(x);
        return x;
    } catch (_) {
        throw new TypeError();
    }
};

// TODO - regex validation
export const validEmail = (x: string) => {
    return x;
};

export const validWithinLength = <T extends { length: number }>(
    x: T,
    min: number,
    max: number
) => {
    if (min <= x.length && x.length <= max) {
        return x;
    }

    throw new TypeError();
};

// Date validation
export const validDate = (x: unknown) => {
    if (typeof x === "object" && x instanceof Date) {
        return x;
    }

    if (typeof x === "string") {
        const date = new Date(x);
        if (!isNaN(date.getTime()) && x === date.toISOString()) {
            return date;
        }

        throw TypeError();
    }

    throw new TypeError();
};

// Array validation
export const validArray = (x: unknown) => {
    if (Array.isArray(x)) {
        return x as unknown[];
    }

    throw new TypeError();
};
export const validEvery = <T, ValidT>(x: T[], validation: (x: T) => ValidT) =>
    x.map(validation);

export type Validations<
    RT extends Resource,
    ExpectedKey extends keyof RT = keyof RT
> = {
    [K in ExpectedKey]: (x: unknown) => RT[K];
};

export const validateResource = <
    RT extends Resource,
    ExpectedKey extends keyof RT = keyof RT
>(
    res: unknown,
    validations: Validations<RT, ExpectedKey>
): Pick<RT, ExpectedKey> => {
    if (typeof res !== "object" || !res) {
        throw new TypeError();
    }

    return Object.fromEntries(
        Object.entries<Validations<RT, ExpectedKey>[ExpectedKey]>(
            validations
        ).map(([key, validation]) => {
            if (key in res) {
                return [key, validation(res[key])];
            }

            throw new TypeError();
        })
    ) as Pick<RT, ExpectedKey>;
};
