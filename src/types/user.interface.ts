import { Document } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  refreshToken?: string | null;
  roles: {
    USER: number;
    ADMIN?: number | undefined;
    EDITOR?: number | undefined;
  };
}

export default interface User extends IUser, Document {}
