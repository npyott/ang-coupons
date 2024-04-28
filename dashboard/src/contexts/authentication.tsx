import { createContext } from "react";
import { User, UserReadKey } from "ang-coupons-types/users";

export type AuthContextType = {
    user?: Pick<User, UserReadKey>;
};

export const AuthContext = createContext<AuthContextType>({});
