import {
    CommonBasedResource,
    Reference,
    ResourceGroupMethods,
    ResourceMethods,
} from ".";
import { User, UserGroup } from "./users";

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

export type CouponMethods = ResourceMethods<
    Coupon,
    "description" | "limit" | "requestValidDuration" | "imageSrc" | "group"
>;

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

export type CouponRequestMethod = Omit<
    ResourceMethods<CouponRequest, "coupon" | "requesterNote" | "responders">,
    "delete" | "update"
>;

export const CouponGroupPrefix = "coupon_group";
export type CouponGroup = CommonBasedResource<
    typeof CouponGroupPrefix,
    {
        description: string;
        parent: Reference<CouponGroup> | null;
        count: number;
    }
>;

export type CouponGroupMethods = ResourceMethods<
    CouponGroup,
    "description" | "parent"
> &
    ResourceGroupMethods<{ group: CouponGroup; resource: Coupon }>;
