import {
    Coupon,
    CouponPrefix,
    CouponRequest,
    CouponRequestPrefix,
    CouponProduct,
    CouponProductPrefix,
} from "./coupons";
import { Session, SessionPrefix } from "./sessions";
import { User, UserPrefix } from "./users";
import { Vendor, VendorPrefix } from "./vendors";

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
    | typeof CouponPrefix
    | typeof CouponProductPrefix
    | typeof CouponRequestPrefix
    | typeof VendorPrefix
    | typeof SessionPrefix;

export type Resource =
    | User
    | Coupon
    | CouponProduct
    | CouponRequest
    | Vendor
    | Session;

export type Reference<RT extends Resource> = RT["_id"];

export type ResourceMethods<
    RT extends Resource,
    CreateKey extends keyof RT,
    ReadKey extends keyof RT,
    UpdateKey extends keyof RT
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
