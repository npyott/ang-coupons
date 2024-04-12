import DynamoDB, { AttributeValue } from "aws-sdk/clients/dynamodb";
import { Resource } from "ang-coupons-2023";

import {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_DYNAMODB_TABLE_NAME,
} from "./config";
import { ExtractTypedKeys, alphabetNumber, itMap } from "./util";

export class ObjectTypeUnimplementedError extends Error {
    constructor(obj: any) {
        super(`Unimplemented object ${obj}`);
    }
}

export class AttributeTypeUnimplementedError extends Error {
    constructor(attribute: keyof AttributeValue) {
        super(`Unimplemented type: ${attribute}`);
    }
}

export class NotFoundError extends Error {
    constructor(id: string) {
        super(`Cannot find ${id}`);
    }
}

export class AttributesNotReturnedError extends Error {
    constructor() {
        super("Attributes were not returned from an update query.");
    }
}

export const dynamoDB = new DynamoDB({
    apiVersion: "2012-08-10",
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: AWS_SECRET_ACCESS_KEY ?? "",
    },
});

export const jsObjectToAttributeValue = (x: any): AttributeValue => {
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
            return { L: x.map(jsObjectToAttributeValue) };
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

            return { L: Array.from(x).map(jsObjectToAttributeValue) };
        }

        const entries = Object.entries(x);
        return {
            M: Object.fromEntries(
                entries.map(([key, value]) => [
                    key,
                    jsObjectToAttributeValue(value),
                ])
            ),
        };
    }

    throw new ObjectTypeUnimplementedError(x);
};

export const attributeValueToJSObject = (x: AttributeValue): any => {
    const unsupportedValueTypes: (keyof AttributeValue)[] = ["B", "BS"];

    for (const unsupportedValueType of unsupportedValueTypes) {
        if (x[unsupportedValueType]) {
            throw new AttributeTypeUnimplementedError(unsupportedValueType);
        }
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

export const getItem = async <RT extends Resource>(id: RT["_id"]) => {
    const res = await dynamoDB
        .getItem({
            Key: { _id: jsObjectToAttributeValue(id) },
            TableName: AWS_DYNAMODB_TABLE_NAME ?? "",
        })
        .promise();

    if (!res.Item) {
        throw new NotFoundError(id);
    }

    return attributeValueToJSObject({ M: res.Item }) as RT;
};

export const putItem = async <RT extends Resource>(x: RT) => {
    await dynamoDB
        .putItem({
            Item: jsObjectToAttributeValue(x).M!,
            TableName: AWS_DYNAMODB_TABLE_NAME ?? "",
        })
        .promise();

    return x;
};

export const updateItem = async <RT extends Resource>(
    key: RT["_id"],
    set: Partial<RT>,
    inc: Partial<ExtractTypedKeys<RT, number>>,
    append: Partial<ExtractTypedKeys<RT, any[]>>
) => {
    const attributes = new Set(
        ...Object.keys(set),
        ...Object.keys(inc),
        ...Object.keys(append)
    );

    const attributeNameAlphaMap = new Map(
        itMap(attributes, (attribute, index) => [
            attribute,
            alphabetNumber(index + 1),
        ])
    );

    const res = await dynamoDB
        .updateItem({
            ExpressionAttributeNames: Object.fromEntries(
                itMap(attributeNameAlphaMap, ([attribute, alpha]) => [
                    `#${alpha}`,
                    attribute,
                ])
            ),
            ExpressionAttributeValues: Object.fromEntries([
                ...Object.values(set).map((value, index) => [
                    `:set${alphabetNumber(index + 1)}`,
                    jsObjectToAttributeValue(value),
                ]),
                ...Object.values(inc).map((value, index) => [
                    `:inc${alphabetNumber(index + 1)}`,
                    jsObjectToAttributeValue(value),
                ]),
                ...Object.values(append).map((value, index) => [
                    `:append${alphabetNumber(index + 1)}`,
                    jsObjectToAttributeValue(value),
                ]),
            ]),
            Key: {
                _id: jsObjectToAttributeValue(key),
            },
            UpdateExpression: `SET ${[
                ...Object.keys(set).map((attribute, index) => {
                    const attributeAlpha =
                        attributeNameAlphaMap.get(attribute)!;
                    const expressionAlpha = `:set${alphabetNumber(index + 1)}`;

                    return `${attributeAlpha} = ${expressionAlpha}`;
                }),
                ...Object.keys(inc).map((attribute, index) => {
                    const attributeAlpha =
                        attributeNameAlphaMap.get(attribute)!;
                    const expressionAlpha = `:inc${alphabetNumber(index + 1)}`;

                    return `${attributeAlpha} = ${attributeAlpha} + ${expressionAlpha}`;
                }),
                ...Object.keys(append).map((attribute, index) => {
                    const attributeAlpha =
                        attributeNameAlphaMap.get(attribute)!;
                    const expressionAlpha = `:append${alphabetNumber(
                        index + 1
                    )}`;

                    return `${attributeAlpha} = list_append(${attributeAlpha}, ${expressionAlpha})`;
                }),
            ].join(", ")}`,
            TableName: AWS_DYNAMODB_TABLE_NAME ?? "",
        })
        .promise();

    if (!res.Attributes) {
        throw new AttributesNotReturnedError();
    }

    return attributeValueToJSObject({ M: res.Attributes }) as RT;
};
