import {
    User,
    UserMethods,
    UserReadKey,
    UserCreateKey,
    UserUpdateKey,
} from "ang-coupons-types/users";
import {
    Validations,
    validDate,
    validEmail,
    validID,
    validString,
    validateObject,
} from "ang-coupons-common/validation";
import { compose } from "ang-coupons-common/functional-utils";

import {
    defaultResourceImplementation,
    createAuthenticatedFetch,
} from "./common";

export const userValidations: Validations<User, UserReadKey> = {
    _id: compose(validString, (x) => validID(x, "user")),
    createdAt: validDate,
    updatedAt: validDate,
    email: compose(validString, validEmail),
    name: validString,
};

export const createUserModule = (
    authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): UserMethods => {
    const defaultMethods = defaultResourceImplementation<
        User,
        UserCreateKey,
        UserReadKey,
        UserUpdateKey
    >(
        "user",
        (res) => validateObject<User, UserReadKey>(res, userValidations),
        authenticatedFetch
    );

    return {
        create: defaultMethods.create,
        delete: defaultMethods.delete,
        get: defaultMethods.get,
        update: defaultMethods.update,
        async sendPasswordToken(options) {
            const res = await authenticatedFetch({
                path: "user",
                method: "POST",
                contentType: "application/json",
                body: options,
            });

            if (typeof res === "boolean" && res) {
                return true;
            }

            throw new TypeError();
        },
        async updatePassword(options) {
            const res = await authenticatedFetch({
                path: "user",
                method: "PUT",
                contentType: "application/json",
                body: options,
            });

            if (typeof res === "boolean" && res) {
                return true;
            }

            throw new TypeError();
        },
    };
};
