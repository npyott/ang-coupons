import { CommonBasedResource, Reference, ResourceMethods } from ".";
import { User } from "./users";

export const VendorPrefix = "vendor";
export type Vendor = CommonBasedResource<
    typeof VendorPrefix,
    {
        name: string;
    }
>;

export type VendorCreateKey = keyof Pick<Vendor, "name">;
export type VendorReadKey = keyof Vendor;
export type VendorUpdateKey = VendorCreateKey;
export type VendorMethods = ResourceMethods<
    Vendor,
    VendorCreateKey,
    VendorReadKey,
    VendorUpdateKey
> & {
    inviteUser: (
        id: Reference<Vendor>,
        options: {
            email: string;
        }
    ) => Promise<boolean>;
    removeUser: (
        id: Reference<Vendor>,
        options: {
            user: Reference<User>;
        }
    ) => Promise<boolean>;
};
