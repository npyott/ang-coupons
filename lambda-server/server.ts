import { APIRequest, APIResponse } from "./request/models";

const resources = [
    'test',
    'coupon',
    'section'
] as const;

export type Resource = (typeof resources)[number];

const unimplementedHandler = async () => ({
    statusCode: 404,
    body: JSON.stringify({
        error: "Path unimplemented."
    })
});

const handlers: Record<Resource, (event: APIRequest) => Promise<APIResponse>> = {
    test: async (event) => ({
        statusCode: 200,
        body: JSON.stringify(event)
    }),
    coupon: unimplementedHandler,
    section: unimplementedHandler
}

const handler = async (event: APIRequest): Promise<APIResponse> => {
    // TODO implement
    const resource = event.headers.resource;
    const resourceID = event.headers.resourceID;
   
    const res = await (handlers[resource] ?? unimplementedHandler)(event)

    return res;
};
