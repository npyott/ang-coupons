import { CommonBasedResource, Reference, ResourceMethods } from ".";
import { Vendor } from "./vendors";

export const UserPrefix = "user";
export type User = CommonBasedResource<
    typeof UserPrefix,
    {
        name: string;
        email: string;
        password: {
            hash: string;
            updatedAt: Date;
        };
        vendors: Set<Reference<Vendor>>;
    }
>;

export type UserCreateKey = keyof Pick<User, "name" | "email">;
export type UserReadKey = keyof Pick<
    User,
    "_id" | "createdAt" | "updatedAt" | "name" | "email"
>;
export type UserUpdateKey = UserCreateKey;
export type UserMethods = Omit<
    ResourceMethods<User, UserCreateKey, UserReadKey, UserUpdateKey>,
    "list"
> & {
    sendPasswordToken: (options: Pick<User, "email">) => Promise<boolean>;
    updatePassword: (options: {
        newPassword: string;
        token: string;
    }) => Promise<boolean>;
};
