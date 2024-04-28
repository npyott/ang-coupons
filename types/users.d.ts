import {
    CommonBasedResource,
    Reference,
    ResourceGroupMethods,
    ResourceMethods,
} from ".";

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
        groups: Set<Reference<UserGroup>>;
    }
>;

export type UserReadKey = keyof Pick<
    User,
    "_id" | "createdAt" | "updatedAt" | "name" | "email"
>;
export type UserUpdateKey = keyof Pick<User, "name" | "email">;
export type UserMethods = Omit<
    ResourceMethods<User, UserUpdateKey, UserReadKey>,
    "list"
> & {
    sendPasswordToken: (options: Pick<User, "email">) => Promise<boolean>;
    updatePassword: (options: {
        newPassword: string;
        token: string;
    }) => Promise<boolean>;
};

export const UserGroupPrefix = "user_group";
export type UserGroup = CommonBasedResource<
    typeof UserGroupPrefix,
    {
        name: string;
        parent: Reference<UserGroup> | Reference<User>;
        count: number;
    }
>;

export type UserGroupUpdateKey = keyof Pick<UserGroup, "name" | "parent">;
export type UserGroupMethods = ResourceMethods<UserGroup, UserGroupUpdateKey> &
    ResourceGroupMethods<{ group: UserGroup; resource: User }, UserReadKey>;
