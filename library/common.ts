import {
    ID,
    Prefix,
    PrefixFromID,
    Reference,
    Resource,
    ResourceMethods,
} from "ang-coupons-2023";

export class UnimplementedError extends Error {
    constructor() {
        super("Error unimplemented.");
    }
}

const addQueryParameters = (
    param: any,
    searchParams: URLSearchParams,
    paramPrefix = ""
) => {
    const paramType = typeof param;

    if (
        paramType === "function" ||
        paramType === "undefined" ||
        paramType === "symbol"
    ) {
        return;
    }

    if (paramType !== "object") {
        searchParams.append(paramPrefix, `${param}`);
        return;
    }

    if (!paramType) {
        searchParams.append(paramPrefix, "null");
        return;
    }

    for (const [key, value] of Object.entries(param)) {
        addQueryParameters(
            value,
            searchParams,
            paramPrefix ? paramPrefix + `[${key}]` : key
        );
    }
};

export const createAuthenticatedFetch =
    (baseURL: string, apiKey: string | undefined = undefined) =>
    (
        options: {
            path: string;
            queryParameters?: Record<string, any>;
        } & (
            | {
                  method: "GET" | "DELETE";
              }
            | {
                  method: "POST" | "PUT" | "PATCH";
                  body: any;
                  contentType: "application/json";
              }
        )
    ): unknown => {
        const url = new URL(baseURL);
        url.pathname = options.path;
        if (options.queryParameters) {
            addQueryParameters(options.queryParameters, url.searchParams);
        }

        return fetch(url, {
            method: options.method,
            headers: {
                ...(apiKey && { "x-api-key": apiKey }),
                ...(options.method === "PATCH" ||
                options.method === "PUT" ||
                options.method === "POST"
                    ? { "Content-Type": "application/json" }
                    : undefined),
            },
            credentials: "same-origin",
            mode: "same-origin",
            redirect: "follow",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: JSON.stringify(options),
        }).then((res) => res.json());
    };

export const defaultResourceImplementation = <
    RT extends Resource,
    UpdateKey extends keyof RT = keyof RT,
    ReadKey extends keyof RT = keyof RT
>(
    prefix: PrefixFromID<Reference<RT>>,
    authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>,
    validator: (res: unknown) => res is Pick<RT, ReadKey> = (
        _res
    ): _res is Pick<RT, ReadKey> => true
): ResourceMethods<RT, UpdateKey, ReadKey> => ({
    async create(options) {
        const res = await authenticatedFetch({
            path: `/${prefix}`,
            method: "PUT",
            body: options,
            contentType: "application/json",
        });

        if (validator(res)) {
            return res;
        }

        throw new UnimplementedError();
    },
    async get(id) {
        const res = await authenticatedFetch({
            path: `/${prefix}/${id}`,
            method: "GET",
        });

        if (validator(res)) {
            return res;
        }

        throw new UnimplementedError();
    },
    async delete(id) {
        const res = await authenticatedFetch({
            path: `/${prefix}/${id}`,
            method: "DELETE",
        });

        if (typeof res === "boolean" && res) {
            return true;
        }

        throw new UnimplementedError();
    },
    async update(id, options) {
        const res = await authenticatedFetch({
            path: `/${prefix}/${id}`,
            method: "PUT",
            body: options,
            contentType: "application/json",
        });

        if (validator(res)) {
            return res;
        }

        throw new UnimplementedError();
    },
    async list(skip, limit) {
        const res = await authenticatedFetch({
            path: `/${prefix}`,
            method: "GET",
            queryParameters: {
                skip,
                limit,
            },
        });

        if (!Array.isArray(res)) {
            throw new UnimplementedError();
        }

        if (res.every(validator)) {
            return res;
        }

        throw new UnimplementedError();
    },
});
