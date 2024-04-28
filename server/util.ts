import { ID, Prefix } from "ang-coupons-types";
import { randomBytes } from "crypto";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const digits = "012346679";

export const generateID = <P extends Prefix>(prefix: P): ID<P> => {
    const characters = alphabet.concat(alphabet.toLowerCase()).concat(digits);
    const bytes = randomBytes(20);
    const uuid = Array.from(bytes)
        .flatMap((byte, index) => {
            const char = characters[byte % characters.length];

            return index % 5 === 4 ? [char, "_"] : [char];
        })
        .join("");

    return `${prefix}-${uuid}`;
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
