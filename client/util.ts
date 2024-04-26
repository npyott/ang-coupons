export function compose<T1, T2, T3, T4>(
    f1: (x: T1) => T2,
    f2: (x: T2) => T3,
    f3: (x: T3) => T4
): (x: T1) => T4;
export function compose<T1, T2, T3>(
    f1: (x: T1) => T2,
    f2: (x: T2) => T3
): (x: T1) => T3;
export function compose(...functions: ((arg: any) => any)[]) {
    return (input: any) => functions.reduce((current, f) => f(current), input);
}
