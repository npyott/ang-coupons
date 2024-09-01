import {
    PrefixFromID,
    Reference,
    Resource,
    ResourceMethods,
} from "ang-coupons-types";

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
    CreateKey extends keyof RT,
    ReadKey extends keyof RT,
    UpdateKey extends keyof RT
>(
    prefix: PrefixFromID<Reference<RT>>,
    validResponse: (res: unknown) => Pick<RT, ReadKey>,
    authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): ResourceMethods<RT, CreateKey, ReadKey, UpdateKey> => ({
    async create(options) {
        const res = await authenticatedFetch({
            path: `/${prefix}`,
            method: "POST",
            body: options,
            contentType: "application/json",
        });

        return validResponse(res);
    },
    async get(id) {
        const res = await authenticatedFetch({
            path: `/${prefix}/${id}`,
            method: "GET",
        });

        return validResponse(res);
    },
    async delete(id) {
        const res = await authenticatedFetch({
            path: `/${prefix}/${id}`,
            method: "DELETE",
        });

        if (typeof res === "boolean" && res) {
            return true;
        }

        throw new TypeError();
    },
    async update(id, options) {
        const res = await authenticatedFetch({
            path: `/${prefix}/${id}`,
            method: "PUT",
            body: options,
            contentType: "application/json",
        });

        return validResponse(res);
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
            throw new TypeError("Expected an array.");
        }

        return res.map(validResponse);
    },
});
