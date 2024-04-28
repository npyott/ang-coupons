export const itEnumerate = function* <T>(it: Iterable<T>) {
    let index = 0;
    for (const x of it) {
        yield [index, x] as [number, T];
    }
};

export const itTake = function* <T>(it: Iterable<T>, take: number) {
    for (const [index, x] of itEnumerate(it)) {
        if (index >= take) {
            break;
        }

        yield x;
    }
};

export const itSkip = function* <T>(it: Iterable<T>, skip: number) {
    for (const [index, x] of itEnumerate(it)) {
        if (index < skip) {
            continue;
        }

        yield x;
    }
};

export const itMap = function* <T, R>(
    it: Iterable<T>,
    map: (value: T, index: number) => R
) {
    for (const [index, x] of itEnumerate(it)) {
        yield map(x, index);
    }
};

export const itFilter = function* <T, R extends T = T>(
    it: Iterable<T>,
    filter: (value: T, index: number) => value is R
) {
    for (const [index, x] of itEnumerate(it)) {
        if (filter(x, index)) {
            yield x;
        }
    }
};

export const itReduce = <T, R>(
    it: Iterable<T>,
    reducer: (previous: R, value: T, index: number) => R,
    initial: R
): R => {
    let previous = initial;
    for (const [index, x] of itEnumerate(it)) {
        previous = reducer(previous, x, index);
    }

    return previous;
};

export const range = function* (start: number, end: number, increment = 1) {
    for (let i = start; i < end; i += increment) {
        yield i;
    }
};
