import { Coupon } from "ang-coupons-2023";

import { generateID } from "../util";
import { putItem, updateItem } from "../aws";

export const createCoupon = async (
    options: Pick<
        Coupon,
        | "description"
        | "imageSrc"
        | "limit"
        | "group"
        | "requestValidDuration"
        | "responders"
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
    id: Coupon["_id"],
    options: Pick<
        Coupon,
        "group" | "limit" | "requestValidDuration" | "imageSrc" | "description"
    >
) => {
    return await updateItem(id, options, {}, {}, TABLE_NAME);
};

export const updateCouponUsage = async (
    id: Coupon["_id"],
    increment: number
) => {};
