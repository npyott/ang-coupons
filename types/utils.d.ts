export type ExtractTypedKeys<T, S> = {
    [K in keyof T as T[K] extends S ? K : never]: T[K];
};

export type Primitive =
    | string
    | number
    | bigint
    | boolean
    | symbol
    | undefined
    | null;
