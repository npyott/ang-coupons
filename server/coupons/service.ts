import { Reference } from "ang-coupons-types";
import { Coupon, CouponMethods } from "ang-coupons-types/coupons";

import { RequestMethods, generateID } from "../util";
import { putItem, updateItem } from "../aws";

export const createCoupon = async (
    options: Pick<
        Coupon,
        "description" | "imageSrc" | "limit" | "group" | "requestValidDuration"
    >
) => {
    const date = new Date();

    return await putItem({
        ...options,
        _id: generateID("coupon"),
        usage: 0,
        createdAt: new Date(date),
        updatedAt: new Date(date),
    });
};

export const updateCoupon = async (
    id: Reference<Coupon>,
    options: Pick<
        Coupon,
        "group" | "limit" | "requestValidDuration" | "imageSrc" | "description"
    >
) => {
    return await updateItem(id, options, {}, {});
};

export const updateCouponUsage = async (
    id: Reference<Coupon>,
    increment: number
) => {};


export const couponModule: RequestMethods<CouponMethods>