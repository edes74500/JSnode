import { Request, Response } from "express";
import { User } from "../types/user.interface";
import users from "../model/users.json";
import bcrypt from "bcrypt";
import fsPromise from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const userDB: { users: User[]; setUsers: (data: User[]) => void } = {
  users: users,
  setUsers: function (data: User[]) {
    this.users = data;
  },
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  console.log("userDB.users:", userDB.users);
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const emailExists = userDB.users.find((user: User) => user.email === req.body.email);
  const usernameExists = userDB.users.find((user: User) => user.username === req.body.username);
  // console.log(userExists);
  if (usernameExists || emailExists) {
    const message = [
      usernameExists ? "This username is already taken" : null,
      emailExists ? "This email is already in use" : null,
    ]
      .filter(Boolean) // Supprime les null ou undefined
      .join(" | "); // Concatène avec un espace

    res.status(400).json({ message });
    return;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser: User = {
    id: uuidv4(),
    username: req.body.username,
    email: req.body.email,
    roles: { USER: 1 },
    password: hashedPassword,
  };
  res.status(201).json(newUser);
  try {
    const filePath = path.resolve(__dirname, "../model/users.json");
    setTimeout(() => {
      fsPromise.writeFile(filePath, JSON.stringify(userDB.users.concat(newUser), null, 2));
    }, 2000);
  } catch (error) {
    console.error("Error writing to file:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
