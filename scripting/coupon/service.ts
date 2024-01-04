import { Coupon } from "ang-coupons-2023/coupons";

import { generateID } from "../util";
import { dynamoDB, jsObectToAttributeValue } from "../aws";

import { PREFIX, TABLE_NAME } from "./constants";

export const createCoupon = async (
    options: Pick<Coupon, "description" | "imageSrc" | "limit" | "section">
) => {
    const date = new Date();

    const coupon: Coupon = {
        ...options,
        _id: generateID(PREFIX),
        usage: 0,
        createdAt: new Date(date),
        updatedAt: new Date(date),
    };

    await dynamoDB
        .putItem({
            Item: jsObectToAttributeValue(coupon).M!,
            TableName: TABLE_NAME,
        })
        .promise();

    return coupon;
};
