import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomRequest } from "../types/customRequest";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export const verifJWT = (req: CustomRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authorization header missing or malformed" });
      return;
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Token not provided" });
      return;
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    if (typeof decoded !== "string") {
      console.log(decoded);
      req.user = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles;
      console.log("JWT verified successfully" + req.user);
    }
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({ message: "Token expired" });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }
    console.error(error); // Ajoutez un log pour les erreurs inattendues
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
