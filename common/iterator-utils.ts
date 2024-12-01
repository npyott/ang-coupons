export const itEnumerate = function* <T>(it: Iterable<T>) {
    let index = 0;
    for (const x of it) {
        yield [index, x] as [number, T];
    }
};

export const range = function* (start: number, end: number, increment = 1) {
    for (let i = start; i < end; i += increment) {
        yield i;
    }
};
