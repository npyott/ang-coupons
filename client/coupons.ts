import {
    Coupon,
    CouponCreateKey,
    CouponGroup,
    CouponGroupCreateKey,
    CouponGroupMethods,
    CouponMethods,
} from "ang-coupons-types/coupons";
import {
    Validations,
    validDate,
    validID,
    validNumber,
    validNumberIntegral,
    validNumberWithinRange,
    validString,
    validURL,
    validateObject,
} from "ang-coupons-common/validation";
import { compose } from "ang-coupons-common/functional-utils";

import {
    defaultResourceImplementation,
    defaultResourceGroupImplementation,
    createAuthenticatedFetch,
} from "./common";

export const couponValidations: Validations<Coupon> = {
    _id: compose(validString, (x) => validID(x, "coupon")),
    createdAt: validDate,
    updatedAt: validDate,
    description: validString,
    group: compose(validString, (x) => validID(x, "coupon_group")),
    imageSrc: compose(validString, validURL),
    limit: compose(validNumber, validNumberIntegral, (x) =>
        validNumberWithinRange(x, 0, Number.MAX_SAFE_INTEGER)
    ),
    usage: compose(validNumber, validNumberIntegral, (x) =>
        validNumberWithinRange(x, 0, Number.MAX_SAFE_INTEGER)
    ),
    requestValidDuration: validNumber,
};

export const createCouponModule = (
    authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): CouponMethods => {
    const defaultMethods = defaultResourceImplementation<
        Coupon,
        CouponCreateKey
    >(
        "coupon",
        (res) => validateObject(res, couponValidations),
        authenticatedFetch
    );

    return defaultMethods;
};

export const couponGroupValidations: Validations<CouponGroup> = {
    _id: compose(validString, (x) => validID(x, "coupon_group")),
    createdAt: validDate,
    updatedAt: validDate,
    parent: (x) => {
        if (x === null) {
            return null;
        }

        return compose(validString, (y) => validID(y, "coupon_group"))(x);
    },
    count: compose(validNumber, validNumberIntegral, (x) =>
        validNumberWithinRange(x, 0, Number.MAX_SAFE_INTEGER)
    ),
    description: validString,
};

export const createCouponGroupModule = (
    authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): CouponGroupMethods => {
    const defaultResource = defaultResourceImplementation<
        CouponGroup,
        CouponGroupCreateKey
    >(
        "coupon_group",
        (res) => validateObject(res, couponGroupValidations),
        authenticatedFetch
    );
    const defaultGroup = defaultResourceGroupImplementation<{
        resource: Coupon;
        group: CouponGroup;
    }>(
        "coupon_group",
        (res) => validateObject(res, couponValidations),
        authenticatedFetch
    );

    return {
        ...defaultResource,
        ...defaultGroup,
    };
};
