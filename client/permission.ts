import { compose } from "ang-coupons-common/functional-utils";
import {
    Validations,
    oneOfValidID,
    someValidID,
    validArray,
    validDate,
    validEvery,
    validID,
    validNumber,
    validNumberIntegral,
    validNumberWithinRange,
    validString,
} from "ang-coupons-common/validation";
import { ResourcePermission } from "ang-coupons-types";

const permissionValidations: Omit<
    Validations<ResourcePermission>,
    "target" | "method"
> = {
    _id: compose(validString, (x) => validID(x, "perm")),
    agent: compose(validString, (x) => oneOfValidID(x, ["user", "user_group"])),
    effect: compose(validString, (x) => {
        if (x === "allow" || x === "deny") {
            return x;
        }

        throw new TypeError();
    }),
    shareable: (x) => {
        if (typeof x === "boolean") {
            return x;
        }

        throw new TypeError();
    },
    priority: (x) => {
        if (typeof x === "undefined") {
            return x;
        }

        return compose(validNumber, validNumberIntegral, (y) =>
            validNumberWithinRange(y, 0, Number.MAX_SAFE_INTEGER)
        )(x);
    },
    grantees: compose(validArray, (x) =>
        validEvery(
            x,
            compose(validString, (x) => oneOfValidID(x, ["user", "user_group"]))
        )
    ),
    createdAt: validDate,
    updatedAt: validDate,
};
