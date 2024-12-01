import type { Primitive } from "../types/utils.d.ts";

export const ROOT = Symbol("Root");

export class Circular {
    constructor(public parentPath: string[] | typeof ROOT) {}
}

export const flattenObjectEntries = (
    entries: [string, unknown][],
    rootObject: Object,
    parentObjectsWithNames: [Object, string][]
): [string[], Primitive | Function | Circular][] => {
    const parentObjects = new Set(parentObjectsWithNames.map(([o]) => o));

    const simpleEntries: [string, Primitive | Function][] = [];
    const objectEntries: [string, Object][] = [];
    const circularEntries: [string, Object][] = [];
    const rootEntries: [string, Object][] = [];

    for (const [k, v] of entries) {
        switch (typeof v) {
            case "string":
            case "number":
            case "bigint":
            case "boolean":
            case "symbol":
            case "undefined":
            case "function":
                simpleEntries.push([k, v]);
                continue;
            case "object":
                if (v === null) {
                    simpleEntries.push([k, v]);
                    continue;
                }

                if (v === rootObject) {
                    objectEntries.push([k, v]);
                    continue;
                }

                if (parentObjects.has(v)) {
                    circularEntries.push([k, v]);
                    continue;
                }

                objectEntries.push([k, v]);
        }
    }

    const flattenedObjectEntries = objectEntries.flatMap(([key, value]) => {
        parentObjectsWithNames.push([value as Object, key]);
        const subEntries = flattenObjectEntries(
            Object.entries(value as Object),
            rootObject,
            parentObjectsWithNames
        );
        parentObjectsWithNames.pop();

        return subEntries.map(
            ([subKey, subValue]): [string[], typeof subValue] => [
                [key, ...subKey],
                subValue,
            ]
        );
    });

    const transformedCircularEntries = circularEntries.map(
        ([key, value]): [string[], Circular] => {
            const previousIndex = parentObjectsWithNames.findIndex(
                ([o]) => o === value
            );

            const circularKey = parentObjectsWithNames
                .slice(0, previousIndex + 1)
                .map(([_, name]) => name);

            return [[key], new Circular(circularKey)];
        }
    );

    const transformedRootEntries = rootEntries.map(
        ([key]): [string[], Circular] => [[key], new Circular(ROOT)]
    );

    return flattenedObjectEntries
        .concat(simpleEntries.map(([k, v]) => [[k], v]))
        .concat(transformedCircularEntries)
        .concat(transformedRootEntries)
        .sort((e1, e2) => {
            for (const [index, key1] of e1[0].entries()) {
                const key2 = e2[0].at(index);

                if (!key2 || key2 > key1) {
                    return 1;
                }

                if (key1 < key2) {
                    return -1;
                }
            }

            return e2[0].length === e1[0].length ? 0 : -1;
        });
};

export const flattenObject = (o: Object) =>
    flattenObjectEntries(Object.entries(o), o, []);
