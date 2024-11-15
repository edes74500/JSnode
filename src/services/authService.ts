import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserModel from "../model/User";
import IUser from "../types/user.interface";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const findUserByRefreshToken = async (refreshToken: string): Promise<IUser | null> => {
  try {
    // Recherche de l'utilisateur par le refresh token
    const foundUser = await UserModel.findOne({ refreshToken });
    return foundUser;
  } catch (error) {
    console.error("Error finding user by refresh token:", error);
    return null;
  }
};
export const findUserByUsername = async (username: string): Promise<IUser | null> => {
  try {
    const foundUser = await UserModel.findOne({ username });
    if (!foundUser) {
      return null;
    }
    return foundUser?.toObject() as IUser;
  } catch (error) {
    console.error("Error finding user by username", error);
    return null;
  }
};

export const createAccessToken = async (user: IUser): Promise<string | undefined> => {
  try {
    const roles = user.roles;
    const username = user.username;

    console.log("roles :", roles);
    const payload = {
      UserInfo: { username: username, roles: roles },
    };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    return accessToken;
  } catch (error) {
    console.error("Error creating access token:", error);
  }
};

export const createRefreshToken = async (username: string): Promise<string | void> => {
  try {
    const foundUser = await findUserByUsername(username);
    if (!foundUser) {
      throw new Error("User not found.");
    }
    const refreshToken = jwt.sign({ username: foundUser.username }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    return refreshToken;
  } catch (error) {
    console.error("Error creating access token:", error);
  }
};

// Valide et décode le refresh token
export const verifyRefreshToken = async (refreshToken: string) => {
  try {
    // Vérifie la validité du token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { username: string };
    if (!decoded) {
      throw new Error("Invalid refresh token.");
    }
    // Vérifie si l'utilisateur existe et si le token correspond

    const foundUser = await findUserByRefreshToken(refreshToken);
    if (!foundUser) {
      throw new Error("Invalid refresh token.");
    }

    // Retourne les données de l'utilisateur
    return foundUser;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid or expired refresh token."); // Erreur JWT
    }
    throw err; // Autres erreurs
  }
};
