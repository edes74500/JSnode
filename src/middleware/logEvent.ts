import { NextFunction, Response, Request } from "express";

import { logEmitter } from "../events/logEmitter";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.method, req.path);
  logEmitter.emit("event", `${req.method}\t${req.headers.origin}\t${req.url}`, "access.log");
  next();
};
