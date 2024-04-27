import { createContext } from "react";
import { User } from "ang-coupons-types";

export type AuthContextType = {
    user?: Pick<User, "name" | "email">;
    token?: string;
};

export const AuthContext = createContext<AuthContextType>({});
