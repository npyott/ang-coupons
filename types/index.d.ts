import {
    Coupon,
    CouponGroup,
    CouponGroupPrefix,
    CouponPrefix,
    CouponRequest,
    CouponRequestPrefix,
} from "./coupons";
import { Session, SessionPrefix } from "./sessions";
import { User, UserGroup, UserGroupPrefix, UserPrefix } from "./users";

export type ID<PrefixT extends Prefix> = `${PrefixT}-${string}`;
export type PrefixFromID<ID extends Reference<Resource>> =
    ID extends `${infer PT}-${string}` ? PT : never;

type CommonResource<PrefixT extends Prefix> = {
    _id: ID<PrefixT>;
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
    | Permission
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
    UpdateKey extends keyof RT = keyof RT,
    ReadKey extends keyof RT = keyof RT
> = {
    create: (options: Pick<RT, UpdateKey>) => Promise<Pick<RT, ReadKey>>;
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

type CommonPermissionEffect = "none" | "read" | "add" | "delete";
type ProcessPermissionEffect = "start" | "complete" | "cancel";
type ResourcePermissionEffect =
    | CommonPermissionEffect
    | ProcessPermissionEffect;

type MetaPermissionEffectBase =
    `${CommonPermissionEffect}-${CommonPermissionEffect}`;
type MetaPermissionEffectAgent = `agent-${MetaPermissionEffectBase}`;
type MetaPermissionEffectTarget = `target-${MetaPermissionEffectBase}`;
type MetaPermissionEffect =
    | MetaPermissionEffectAgent
    | MetaPermissionEffectTarget;

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

export type PermissionMethods = Pick<
    ResourceMethods<Permission, "agents" | "effect" | "target" | "priority">,
    "create" | "delete"
> & {
    listPermissions: (options: Reference<Resource>) => Permission[];
};
