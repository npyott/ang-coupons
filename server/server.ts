import { APIRequest, APIResponse } from "./request/models";

import { Prefix } from "ang-coupons-2023";

const unimplementedHandler = async () => ({
    statusCode: 404,
    body: JSON.stringify({
        error: "Path unimplemented.",
    }),
});

const handlers: Record<
    Prefix | "test",
    (event: APIRequest) => Promise<APIResponse>
> = {
    test: async (event) => ({
        statusCode: 200,
        body: JSON.stringify(event),
    }),
    coupon: unimplementedHandler,
    coupon_group: unimplementedHandler,
    coupon_request: unimplementedHandler,
    user: unimplementedHandler,
    user_group: unimplementedHandler,
    perm: unimplementedHandler,
};

const validPrefix = (value: string): value is Prefix => {
    const prefixes: Prefix[] = [
        "user",
        "user_group",
        "coupon",
        "coupon_group",
        "coupon_request",
    ];

    return prefixes.some((prefix) => prefix === value);
};

export const handler = async (event: APIRequest): Promise<APIResponse> => {
    // TODO implement
    const resource = event.headers.resource;
    const resourceID = event.headers.resourceID;

    if (!validPrefix(resource) && resource !== "test") {
        return await unimplementedHandler();
    }

    const res = await handlers[resource](event);

    return res;
};
