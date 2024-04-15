import {
    GroupedResource,
    PrefixFromID,
    Reference,
    Resource,
    ResourceGroupMethods,
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
    validResponse: (res: unknown) => Pick<RT, ReadKey> = (res) =>
        res as Pick<RT, ReadKey>
): ResourceMethods<RT, UpdateKey, ReadKey> => ({
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

        throw new UnimplementedError();
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
            throw new UnimplementedError();
        }

        return res.map(validResponse);
    },
});

export const defaultResourceGroupImplementation = <
    GroupT extends GroupedResource,
    ReadKey extends keyof GroupT["resource"] = keyof GroupT["resource"]
>(
    prefix: PrefixFromID<Reference<GroupT["group"]>>,
    authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>,
    validResourceResponse: (
        res: unknown
    ) => Pick<GroupT["resource"], ReadKey> = (res) =>
        res as Pick<GroupT["resource"], ReadKey>
): ResourceGroupMethods<GroupT, ReadKey> => ({
    async add(id, options) {
        const res = await authenticatedFetch({
            path: `/${prefix}/${id}`,
            method: "PUT",
            body: options,
            contentType: "application/json",
        });

        if (
            typeof res !== "object" ||
            !res ||
            !("added" in res) ||
            typeof res.added !== "number"
        ) {
            throw new UnimplementedError();
        }

        return {
            added: res.added,
        };
    },
    async remove(id, options) {
        const res = await authenticatedFetch({
            path: `/${prefix}/${id}`,
            method: "PUT",
            body: options,
            contentType: "application/json",
        });

        if (
            typeof res !== "object" ||
            !res ||
            !("removed" in res) ||
            typeof res.removed !== "number"
        ) {
            throw new UnimplementedError();
        }

        return {
            removed: res.removed,
        };
    },
    async listItems(id, skip, limit) {
        const res = await authenticatedFetch({
            path: `/${prefix}/${id}`,
            method: "GET",
            queryParameters: {
                skip,
                limit,
            },
        });

        if (!Array.isArray(res)) {
            throw new UnimplementedError();
        }

        return res.map(validResourceResponse);
    },
});
