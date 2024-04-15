import {
    User,
    UserMethods,
    UserReadKey,
    UserUpdateKey,
} from "ang-coupons-2023";

import {
    defaultResourceImplementation,
    defaultResourceGroupImplementation,
    createAuthenticatedFetch,
} from "./common";
import {
    Validations,
    validDate,
    validEmail,
    validID,
    validString,
    validateResource,
} from "./validation";
import { compose } from "./util";

const userValidations: Validations<User, UserReadKey> = {
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
        UserUpdateKey,
        UserReadKey
    >("user", authenticatedFetch, (res) =>
        validateResource(res, userValidations)
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
