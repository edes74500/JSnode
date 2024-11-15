import { allowedOrigins } from "../config/alllowedOrigins";
import { NextFunction, Response, Request } from "express";

export const credential = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (!origin) {
    console.log("No origin header found, assuming Postman or non-browser environment");
    next();
    return;
  }
  if (allowedOrigins.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    next();
  }
};
