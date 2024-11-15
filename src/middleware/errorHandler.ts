import { NextFunction } from "express";
import { logEmitter } from "../events/logEmitter";

export const errorHandler = (err: any, req: any, res: any, next: NextFunction) => {
  logEmitter.emit("event", `Error handling request: ${err?.message || "Unknown error"}`, "error.log");
  res.status(500).send("Something went wrong, please try again later. " + err.message);
};
