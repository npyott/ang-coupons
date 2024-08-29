import { CommonBasedResource, Reference, ResourceMethods } from ".";
import { User } from "./users";
import { Vendor } from "./vendors";

export const CouponPrefix = "coupon";
export type Coupon = CommonBasedResource<
    typeof CouponPrefix,
    {
        description: string;
        limit: number;
        usage: number;
        requestValidDuration: number;
        imageSrc: string;
        vendor: Reference<Vendor>;
    }
>;

export type CouponCreateKey = keyof Pick<
    Coupon,
    "description" | "limit" | "requestValidDuration" | "imageSrc"
>;
export type CouponReadKey = keyof Coupon;
export type CouponUpdateKey = keyof Pick<Coupon, "description" | "imageSrc">;

export type CouponMethods = ResourceMethods<
    Coupon,
    CouponCreateKey,
    CouponReadKey,
    CouponUpdateKey
>;

export const CouponRequestPrefix = "coupon_request";
export type CouponRequest = CommonBasedResource<
    typeof CouponRequestPrefix,
    {
        coupon: Reference<Coupon>;
        status: "pending" | "completed" | "failed" | "cancelled" | "expired";
        requesterNote: string;
        responderNote: string;
        consumer: Reference<User>;
        vendor: Reference<Vendor>;
    }
>;

export type CouponRequestCreateKey = keyof Pick<
    CouponRequest,
    "coupon" | "requesterNote"
>;
export type CouponRequestReadKey = keyof CouponRequest;
export type CouponRequestMethods = Omit<
    ResourceMethods<
        CouponRequest,
        CouponRequestCreateKey,
        CouponRequestReadKey,
        never
    >,
    "update"
> & {
    fulfill: (
        options: Pick<CouponRequest, "responderNote">
    ) => Promise<boolean>;
};
