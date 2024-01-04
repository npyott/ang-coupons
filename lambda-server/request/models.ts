export interface APIRequest {
    resource: string;
    path: string;
    httpMethod: string;
    headers: Record<string, string> & {
        resource: string;
        resourceID?: string;
    };
    multiValueHeaders: Record<string, string[]>;
    queryStringParameters: Record<string, string>;
    multiValueQueryStringParameters: Record<string, string[]>;
    pathParameters: any;
    stageVariables: any;
    requestContext: RequestContext;
    body: string | null;
    isBase64Encoded: boolean;
}

interface RequestContext {
    resourceId: string;
    resourcePath: string;
    httpMethod: string;
    extendedRequestId: string;
    requestTime: string;
    path: string;
    accountId: string;
    protocol: string;
    stage: string;
    domainPrefix: string;
    requestTimeEpoch: number;
    requestId: string;
    identity: Identity;
    domainName: string;
    apiId: string;
}

interface Identity {
    cognitoIdentityPoolId: string | null;
    cognitoIdentityId: string | null;
    apiKey: string;
    principalOrgId: string | null;
    cognitoAuthenticationType: string | null;
    userArn: string;
    apiKeyId: string;
    userAgent: string;
    accountId: string;
    caller: string;
    sourceIp: string;
    accessKey: string;
    cognitoAuthenticationProvider: any;
    user: string;
}

export interface APIResponse {
    statusCode: number;
    body: string;
}
