export type ExtractTypedKeys<T, S> = {
    [K in keyof T as T[K] extends S ? K : never]: T[K];
};
