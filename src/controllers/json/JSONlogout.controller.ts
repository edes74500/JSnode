import { Response, Request } from "express";
import { createAccessToken, verifyRefreshToken } from "../services/authService";
import { User } from "../types/user.interface";
import users from "../model/users.json";
import fsPromises from "fs/promises";
import path from "path";

const userDB: { users: User[] } = {
  users: users,
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      res.status(400).json({ error: "No refresh token provided." }); // Bad Request
      return;
    }

    const foundUser: User = await verifyRefreshToken(refreshToken);
    if (!foundUser) {
      res.clearCookie("jwt");
      console.log("user not found and jwt cookie cleared");
      res.status(200).json({ error: "No user found to log out, cookie cleared" }); //204 is No Content
      return;
    }

    const filterdDB = userDB.users.filter((user: User) => user.refreshToken !== refreshToken);
    const updatedUser: User = { ...foundUser, refreshToken: undefined };
    res.clearCookie("jwt");
    console.log("jwt cookie cleared and user logged out");
    res.status(200).json({ message: "User logged out and refresh token removed" });

    setTimeout(() => {
      fsPromises.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify([...filterdDB, updatedUser], null, 2),
      );
    }, 2000); // Update user's data in the database after 2 seconds to avoid race conditions.
  } catch (error: any) {
    const errorMessage = error.message || "Internal error logging out";
    console.error(errorMessage);
    res.status(500).json({ message: errorMessage });
  }
};
