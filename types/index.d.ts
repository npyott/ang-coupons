type CommonResource<PrefixT extends Prefix> = {
    _id: `${PrefixT}+${string}`;
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
    | typeof CouponGroupPrefix;

export type Resource =
    | User
    | UserGroup
    | Permission<any>
    | Coupon
    | CouponRequest
    | CouponGroup;

export type Reference<ResourceT extends Resource> = ResourceT["_id"];

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
        groups: Reference<UserGroup>[];
    }
>;

export const UserGroupPrefix = "user_group";
export type UserGroup = CommonBasedResource<
    typeof UserGroupPrefix,
    {
        name: string;
        owner: Reference<UserGroup> | Reference<User>;
    }
>;

type CommonPermissionEffects =
    | "none"
    | "readonly"
    | "add"
    | "delete"
    | "modify";
type CouponPermissionEffects = "redeem" | "fulfill";

export const PermissionPrefix = "perm";
export type Permission<ResourceT extends Resource> = CommonBasedResource<
    typeof PermissionPrefix,
    {
        assignees: (Reference<User> | Reference<UserGroup>)[];
        resource: Reference<ResourceT>;
        effect: ResourceT extends Coupon | CouponGroup
            ? CouponPermissionEffects | CommonPermissionEffects
            : CommonPermissionEffects;
        priority: number;
    }
>;

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
        responders: (Reference<User> | Reference<UserGroup>)[];
    }
>;

export const CouponRequestPrefix = "coupon_request";
export type CouponRequest = CommonBasedResource<
    typeof CouponRequestPrefix,
    {
        coupon: Reference<Coupon>;
        status: "pending" | "completed" | "failed";
        requesterNote: string;
        responderNote: string;
        requester: Reference<User>;
        responders: (Reference<UserGroup> | Reference<User>)[];
    }
>;

export const CouponGroupPrefix = "coupon_group";
export type CouponGroup = CommonBasedResource<
    typeof CouponGroupPrefix,
    {
        description: string;
        parent: Reference<CouponGroup> | null;
    }
>;
