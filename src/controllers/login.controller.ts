import bcrypt from "bcrypt";
import { Request, Response } from "express";
import UserModel from "../model/User";
import { createAccessToken, createRefreshToken } from "../services/authService";

export const handleLogin = async (req: Request, res: Response) => {
  console.log("Login request received");
  const { username, email, password } = req.body;

  if (!(username || email) || !password) {
    res.status(400).json({ message: "Please provide user and password" });
    return;
  }

  const userFound = await UserModel.findOne({ $or: [{ username: username }, { email: email }] });

  if (!userFound) {
    res.status(401).json({ message: "Users not found" });
    return;
  }

  try {
    const validPassword: boolean = await bcrypt.compare(password, userFound.password);
    if (!validPassword) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }
    console.log("starting to create JWT tokens");
    //! acces token and refresh token generation here
    console.log("acces token ", userFound);
    const accessToken = await createAccessToken(userFound);

    if (!accessToken) {
      throw new Error("Failed to create access token.");
    }

    const refreshToken = await createRefreshToken(userFound.username);

    if (!refreshToken) {
      throw new Error("Failed to create refresh token.");
    }

    const updateUser = await UserModel.findByIdAndUpdate(userFound._id, { refreshToken }, { new: true });

    if (!updateUser) {
      throw new Error("Failed to update user.");
    }

    const refreshTokenOption = {
      expiresIn: "7d",
      httpOnly: true,
      sameSite: "none" as "none",
      secure: true,
    };

    res.cookie("jwt", refreshToken, refreshTokenOption);
    res.json({ accessToken });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error logging in:", error.message);
      res.status(500).json({ message: `Error logging in: ${error.message}` });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};
