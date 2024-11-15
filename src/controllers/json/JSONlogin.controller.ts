import { Request, Response } from "express";
import users from "../model/users.json";
import { User } from "../types/user.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fsPromise from "fs/promises";
import path from "path";
import { createRefreshToken, createAccessToken } from "../services/authService";

const userDB: { users: User[] } = {
  users: users,
};

// dotenv.config();
// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
// const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const handleLogin = async (req: Request, res: Response) => {
  console.log("Login request received");
  const { username, email, password } = req.body;

  if (!(username || email) || !password) {
    res.status(400).json({ message: "Please provide user and password" });
    return;
  }

  const userFound = userDB.users.find((u) => u.username === username || u.email === email);
  if (!userFound) {
    res.status(401).json({ message: "User not found" });
    return;
  }

  try {
    const validPassword: boolean = await bcrypt.compare(password, userFound.password);
    if (!validPassword) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    //! acces token and refresh token generation here
    const accessToken: string = createAccessToken(userFound.username);
    const refreshToken: string = createRefreshToken(userFound.username);

    const filteredUsersDB: User[] = userDB.users.filter((u) => u.username !== userFound.username);
    console.log(filteredUsersDB);
    const updatedUser: User = { ...userFound, refreshToken };

    const refreshTokenOption = {
      expiresIn: "7d",
      httpOnly: true,
      sameSite: "none" as "none",
      secure: true,
    };

    res.cookie("jwt", refreshToken, refreshTokenOption);
    res.json({ accessToken });

    //! Save updated user data to users.json after 2 seconds to simulate asynchronous operation
    setTimeout(() => {
      fsPromise.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify([...filteredUsersDB, updatedUser], null, 2),
      );
    }, 2000);
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};
