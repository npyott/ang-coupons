import {
    Coupon,
    CouponGroup,
    CouponGroupPermission,
    CouponGroupPrefix,
    CouponPermission,
    CouponPrefix,
    CouponRequest,
    CouponRequestPermission,
    CouponRequestPrefix,
} from "./coupons";
import { Session, SessionPrefix } from "./sessions";
import {
    User,
    UserGroup,
    UserGroupPermission,
    UserGroupPrefix,
    UserPermission,
    UserPrefix,
} from "./users";

export type ID<PrefixT extends Prefix> = `${PrefixT}-${string}`;
export type PrefixFromID<ID extends Reference<Resource>> =
    ID extends `${infer PT}-${string}` ? PT : never;

type CommonResource<PrefixT extends Prefix> = {
    _id: ID<PrefixT>;
    createdAt: Date;
    updatedAt: Date;
};

export type CommonBasedResource<PrefixT extends Prefix, T> = T &
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
    | ResourcePermission
    | Coupon
    | CouponRequest
    | CouponGroup
    | Session;

export type GroupedResource =
    | {
          group: UserGroup;
          resource: User;
      }
    | {
          group: CouponGroup;
          resource: Coupon;
      };

export type Reference<RT extends Resource> = RT["_id"];

export type ResourceMethods<
    RT extends Resource,
    CreateKey extends keyof RT = keyof RT,
    ReadKey extends keyof RT = keyof RT,
    UpdateKey extends keyof RT = CreateKey
> = {
    create: (options: Pick<RT, CreateKey>) => Promise<Pick<RT, ReadKey>>;
    get: (id: Reference<RT>) => Promise<Pick<RT, ReadKey>>;
    delete: (id: Reference<RT>) => Promise<boolean>;
    update: (
        id: Reference<RT>,
        options: Pick<RT, UpdateKey>
    ) => Promise<Pick<RT, ReadKey>>;
    list: (skip: number, limit: number) => Promise<Pick<RT, ReadKey>[]>;
};

export type ResourceGroupMethods<
    GroupT extends GroupedResource,
    ReadKey extends keyof GroupT["resource"] = keyof GroupT["resource"]
> = {
    add: (
        id: Reference<GroupT["group"]>,
        options: { items: Reference<GroupT["resource"]> }
    ) => Promise<{ added: number }>;
    remove: (
        id: Reference<GroupT["group"]>,
        options: { items: Reference<GroupT["resource"]> }
    ) => Promise<{ removed: number }>;
    listItems: (
        id: Reference<GroupT["group"]>,
        skip: number,
        limit: number
    ) => Promise<Pick<GroupT["resource"], ReadKey>[]>;
};

export const PermissionPrefix = "perm";
type Agent = User | UserGroup;
export type CommonBasedPermission<
    Target extends Resource,
    TargetMethodKey extends string
> = CommonBasedResource<
    typeof PermissionPrefix,
    {
        agent: Reference<Agent>;
        target: Reference<Target>;
        method: TargetMethodKey;
        effect: "allow" | "deny";
        priority?: number;
        grantees: Reference<Agent>[];
        shareable: boolean;
    }
>;

export type ResourcePermission =
    | UserPermission
    | UserGroupPermission
    | CouponPermission
    | CouponRequestPermission
    | CouponGroupPermission;

export type PermissionMethods = {
    listPermissionsOnTarget: (
        options: Reference<Resource>
    ) => ResourcePermission[];
    listPermissionsOnAgent: (options: Reference<Agent>) => ResourcePermission[];
    sharePermission: (options: {
        permission: Reference<ResourcePermission>;
        agent: Reference<Agent>;
        shareable: boolean;
    }) => Promise<ResourcePermission>;
    rescindPermission: (options: {
        permission: Reference<ResourcePermission>;
        agent: Reference<Agent>;
        descend: boolean;
    }) => Promise<boolean>;
};
