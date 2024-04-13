export type ID<PrefixT extends Prefix> = `${PrefixT}+${string}`;

type CommonResource<PrefixT extends Prefix> = {
    _id: ID<Prefix>;
    createdAt: Date;
    updatedAt: Date;
};

type CommonBasedResource<PrefixT extends Prefix, T> = T &
    CommonResource<PrefixT>;

export type Prefix =
    | typeof UserPrefix
    | typeof UserGroupPrefix
    | typeof PermissionPrefix
    | typeof CouponPrefix
    | typeof CouponRequestPrefix
    | typeof CouponGroupPrefix
    | typeof SessionPrefix;

export type Resource =
    | User
    | UserGroup
    | Permission<any>
    | Coupon
    | CouponRequest
    | CouponGroup
    | Session;

export type Reference<RT extends Resource> = RT["_id"];

export type ResourceMethods<
    RT extends Resource,
    UpdateKey extends keyof RT = keyof RT,
    ReadKey extends keyof RT = keyof RT
> = {
    create: (options: Pick<RT, UpdateKey>) => Promise<Pick<RT, ReadKey>>;
    get: (id: Reference<RT>) => Promise<Pick<RT, ReadKey>>;
    delete: (id: Reference<RT>) => Promise<Pick<RT, ReadKey>>;
    update: (
        id: Reference<RT>,
        options: Pick<RT, UpdateKey>
    ) => Promise<Pick<RT, ReadKey>>;
    list: (skip: number, limit: number) => Promise<Pick<RT, ReadKey>[]>;
};

export type ResourceGroupMethods<
    T extends
        | {
              group: UserGroup;
              resource: User;
          }
        | {
              group: CouponGroup;
              resource: Coupon;
          },
    ReadKey extends keyof RT = keyof RT,
    RG = T["group"],
    RT = T["resource"]
> = {
    add: (
        id: Reference<RG>,
        options: { items: Reference<RT> }
    ) => Promise<{ added: number }>;
    remove: (
        id: Reference<RG>,
        options: { items: Reference<RT> }
    ) => Promise<{ removed: number }>;
    listItems: (
        id: Reference<RG>,
        skip: number,
        list: number
    ) => Promise<Pick<RT, ReadKey>[]>;
};

export const UserPrefix = "user";
export type User = CommonBasedResource<
    typeof UserPrefix,
    {
        name: string;
        email: string;
        password: {
            hash: string;
            updatedAt: Date;
        };
        groups: Set<Reference<UserGroup>>;
    }
>;

export type UserReadKey = keyof Pick<
    User,
    "_id" | "createdAt" | "updatedAt" | "name" | "email"
>;
export type UserUpdateKey = keyof Pick<User, "name" | "email">;
export type UserMethods = ResourceMethods<User, UserUpdateKey, UserReadKey> & {
    sendPasswordToken: (options: Pick<User, "email">) => Promise<boolean>;
    updatePassword: (options: {
        newPassword: string;
        token: string;
    }) => Promise<boolean>;
};

export const UserGroupPrefix = "user_group";
export type UserGroup = CommonBasedResource<
    typeof UserGroupPrefix,
    {
        name: string;
        parent: Reference<UserGroup> | Reference<User>;
        count: number;
    }
>;

export type UserGroupUpdateKey = keyof Pick<UserGroup, "name" | "parent">;
export type UserGroupMethods = ResourceMethods<UserGroup, UserGroupUpdateKey> &
    ResourceGroupMethods<{ group: UserGroup; resource: User }, UserReadKey>;

type CommonPermissionEffect = "none" | "read" | "add" | "delete";
type ProcessPermissionEffect = "start" | "complete";
type ResourcePermissionEffect = CommonPermissionEffect | CouponPermissionEffect;

type MetaPermissionEffectBase =
    `${CommonPermissionEffect}-${CommonPermissionEffect}`;
type MetaPermissionEffectAgent = `agent-${MetaPermissionEffectBase}`;
type MetaPermissionEffectTarget = `target-${MetaPermissionEffectBase}`;
type MetaPermissionEffect =
    | MetaPermissionEffectAgent
    | MetaPermissionEffectAgent;

export type PermissionEffect = ResourcePermissionEffect | MetaPermissionEffect;

export const PermissionPrefix = "perm";
export type Permission = CommonBasedResource<
    typeof PermissionPrefix,
    {
        agents: (Reference<User> | Reference<UserGroup>)[];
        target: Reference<Resource>;
        effect: PermissionEffect;
        priority?: number;
    }
>;

export type PermissionMethods = {
    create: (
        options: Pick<Permission, "agents" | "target" | "effect" | "priority">
    ) => Permission[];
    delete: (id: Reference<Permission>) => boolean;
    listPermissions: (options: Reference<Resource>) => Permission[];
};

export const CouponPrefix = "coupon";
export type Coupon = CommonBasedResource<
    typeof CouponPrefix,
    {
        description: string;
        limit: number;
        usage: number;
        requestValidDuration: number;
        imageSrc: string;
        group: Reference<CouponGroup>;
    }
>;

export type CouponMethods = {
    create: (
        options: Pick<
            Coupon,
            | "description"
            | "limit"
            | "requestValidDuration"
            | "imageSrc"
            | "group"
        >
    ) => Coupon;
    delete: (id: Reference<Coupon>) => boolean;
    update: (
        id: Reference<Coupon>,
        options: Pick<
            Coupon,
            | "description"
            | "limit"
            | "requestValidDuration"
            | "imageSrc"
            | "group"
        >
    ) => Coupon;
};

export const CouponRequestPrefix = "coupon_request";
export type CouponRequest = CommonBasedResource<
    typeof CouponRequestPrefix,
    {
        coupon: Reference<Coupon>;
        status: "pending" | "completed" | "failed" | "cancelled";
        requesterNote: string;
        responderNote: string;
        requester: Reference<User>;
        responders: (Reference<UserGroup> | Reference<User>)[];
    }
>;

export type CouponRequestMethod = {
    create: (
        options: Pick<CouponRequest, "coupon" | "requesterNote" | "responders">
    ) => CouponRequest;
    cancel: (options: Pick<CouponRequest, "_id">) => boolean;
    fulfill: (options: Pick<CouponRequest, "_id" | "responderNote">) => boolean;
};

export const CouponGroupPrefix = "coupon_group";
export type CouponGroup = CommonBasedResource<
    typeof CouponGroupPrefix,
    {
        description: string;
        parent: Reference<CouponGroup> | null;
        count: number;
    }
>;

export type CouponGroupMethods = {
    create: (
        options: Pick<CouponGroup, "description" | "parent">
    ) => CouponGroup;
    delete: (id: Reference<CouponGroup>) => boolean;
    update: (
        id: Reference<CouponGroup>,
        options: Pick<CouponGroup, "description" | "parent">
    ) => CouponGroup;
    add: (
        id: Reference<CouponGroup>,
        options: { coupons: Reference<Coupon>[] }
    ) => {
        added: number;
    };
    remove: (
        id: Reference<CouponGroup>,
        options: { coupons: Reference<Coupon>[] }
    ) => {
        removed: number;
    };
    listItems: (id: Reference<CouponGroup>) => Coupon[];
};

export const SessionPrefix = "session";
export type Session = CommonBasedResource<
    typeof SessionPrefix,
    {
        user: Reference<User>;
        expiration: Date;
        ip: string;
        logout: boolean;
        previous?: Reference<Session>;
        next?: Reference<Session>;
    }
>;

export type SessionMethods = {
    login: (options: { email: string; password: string }) => Session;
    logout: (options: { session: Reference<Session> }) => void;
    refresh: (options: { session: Reference<Session> }) => Session;
};
