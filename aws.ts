import DynamoDB, { AttributeValue } from "aws-sdk/clients/dynamodb";

import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "./config";

export class AttributeTypeUnimplementedError extends Error {
    constructor(attribute: keyof AttributeValue) {
        super(`Unimplemented type: ${attribute}`);
    }
}

export const dynamoDB = new DynamoDB({
    apiVersion: "2012-08-10",
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

export const jsObectToAttributeValue = (x: any): AttributeValue => {
    if (typeof x === "number" || typeof x === "bigint") {
        return { N: `${x}` };
    }

    if (typeof x === "boolean") {
        return { BOOL: x };
    }

    if (typeof x === "string") {
        return { S: x };
    }

    if (typeof x === "undefined") {
        return { NULL: true };
    }

    if (typeof x === "object") {
        if (!x) {
            return { NULL: true };
        }

        if (Array.isArray(x)) {
            return { L: x.map(jsObectToAttributeValue) };
        }

        if (x instanceof Date) {
            return { S: `$$$date_${x.toISOString()}` };
        }

        if (x instanceof Set) {
            const types = Array.from(x).map((v) => typeof v);

            if (types.every((type) => type === "string")) {
                return { SS: Array.from(x) };
            }

            if (types.every((type) => type === "number")) {
                return { NS: Array.from(x) };
            }

            return { L: Array.from(x).map(jsObectToAttributeValue) };
        }

        const entries = Object.entries(x);
        return {
            M: Object.fromEntries(
                entries.map(([key, value]) => [
                    key,
                    jsObectToAttributeValue(value),
                ])
            ),
        };
    }
};

export const attributeValueToJSObject = (x: AttributeValue) => {
    const unsupportedValueTypes: (keyof AttributeValue)[] = ["B", "BS"];

    for (const unsupportedValueType of unsupportedValueTypes) {
        if (x[unsupportedValueType]) {
            throw new AttributeTypeUnimplementedError(unsupportedValueType);
        }
    }

    if (x.NS) {
        throw new AttributeTypeUnimplementedError("NS");
    }

    if (x.BOOL) {
        return x.BOOL;
    }

    if (x.S) {
        return x.S;
    }

    if (x.N) {
        return parseFloat(x.N);
    }

    if (x.NULL) {
        return null;
    }

    if (x.L) {
        return x.L.map((y) => attributeValueToJSObject(y));
    }

    if (x.SS) {
        return new Set(x.SS);
    }

    if (x.NS) {
        return new Set(x.NS.map((v) => parseFloat(v)));
    }

    if (x.M) {
        const entries = Object.entries(x.M);

        return Object.fromEntries(
            entries.map(([key, value]) => [
                key,
                attributeValueToJSObject(value),
            ])
        );
    }
};
