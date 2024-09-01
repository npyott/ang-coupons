import {
    Coupon,
    CouponCreateKey,
    CouponMethods,
    CouponReadKey,
    CouponUpdateKey,
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
    createAuthenticatedFetch,
} from "./common";

export const couponValidations: Validations<Coupon> = {
    _id: compose(validString, (x) => validID(x, "coupon")),
    createdAt: validDate,
    updatedAt: validDate,
    description: validString,
    imageSrc: compose(validString, validURL),
    limit: compose(validNumber, validNumberIntegral, (x) =>
        validNumberWithinRange(x, 0, Number.MAX_SAFE_INTEGER)
    ),
    usage: compose(validNumber, validNumberIntegral, (x) =>
        validNumberWithinRange(x, 0, Number.MAX_SAFE_INTEGER)
    ),
    requestValidDuration: validNumber,
    vendor: compose(validString, (x) => validID(x, "vendor")),
};

export const createCouponModule = (
    authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): CouponMethods => {
    const defaultMethods = defaultResourceImplementation<
        Coupon,
        CouponCreateKey,
        CouponReadKey,
        CouponUpdateKey
    >(
        "coupon",
        (res) => validateObject(res, couponValidations),
        authenticatedFetch
    );

    return defaultMethods;
};
