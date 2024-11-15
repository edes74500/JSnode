import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/customRequest";

export const verifyRoles =
  (roles: number[]) =>
  (req: CustomRequest, res: Response, next: NextFunction): void => {
    if (!Array.isArray(roles) || roles.length === 0) {
      throw new Error("Roles must be a non-empty array");
    }

    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!req.roles) {
      res.status(403).json({ message: "User does not have any roles assigned" });
      return;
    }

    const userRoles = Object.values(req.roles);
    const isAllowed = roles.some((role) => userRoles?.includes(role));

    if (!isAllowed) {
      res.status(403).json({ message: "User does not have the required roles" });
      return;
    }
    console.log("user has required roles");
    next();
  };
