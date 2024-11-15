import { Response, Request } from "express";
import { createAccessToken, verifyRefreshToken } from "../services/authService";
import IUser from "../types/user.interface";

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      res.status(401).json({ error: "No refresh token provided." });
      return;
    }

    const foundUser: IUser = await verifyRefreshToken(refreshToken);
    console.log("refresh token found user: ", foundUser);
    const accessToken = await createAccessToken(foundUser);

    res.status(200).json({ accessToken });
  } catch (error: any) {
    const errorMessage = error.message || "Internal error refreshing token";
    res.status(500).json({ error: errorMessage });
    return;
  }
};
