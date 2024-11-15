import { allowedOrigins } from "./alllowedOrigins";

export const corsOptions = {
  origin: (origin: any, callback: (err: any, allow?: boolean) => void) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // status code for successful requests without CORS headers
};
