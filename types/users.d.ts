import {
    CommonBasedPermission,
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
export type UserCreateKey = keyof Pick<User, "name" | "email">;
export type UserMethods = Omit<
    ResourceMethods<User, UserCreateKey, UserReadKey>,
    "list"
> & {
    sendPasswordToken: (options: Pick<User, "email">) => Promise<boolean>;
    updatePassword: (options: {
        newPassword: string;
        token: string;
    }) => Promise<boolean>;
};

export type UserPermission = CommonBasedPermission<User, keyof UserMethods>;

export const UserGroupPrefix = "user_group";
export type UserGroup = CommonBasedResource<
    typeof UserGroupPrefix,
    {
        name: string;
        parent: Reference<UserGroup> | Reference<User>;
        count: number;
    }
>;

export type UserGroupCreateKey = keyof Pick<UserGroup, "name" | "parent">;
export type UserGroupMethods = ResourceMethods<UserGroup, UserGroupCreateKey> &
    ResourceGroupMethods<{ group: UserGroup; resource: User }, UserReadKey>;

export type UserGroupPermission = CommonBasedPermission<
    UserGroup,
    keyof UserGroupMethods
>;
