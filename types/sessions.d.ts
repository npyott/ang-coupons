import { CommonBasedResource, Reference } from ".";
import { User, UserReadKey } from "./users";

export const SessionPrefix = "session";
export type Session = CommonBasedResource<
    typeof SessionPrefix,
    {
        user: Reference<User>;
        expiration: Date;
        ip: string;
        logout: boolean;
        previous?: Reference<Session>;
        next?: Reference<Session>;
    }
>;

export type SessionMethods = {
    login: (options: {
        email: string;
        password: string;
    }) => Pick<User, UserReadKey>;
    logout: () => void;
    refresh: () => Pick<User, UserReadKey>;
};
