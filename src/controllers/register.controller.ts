import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../model/User";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  console.log(UserModel);
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  const userAlreadyExists = await UserModel.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  // console.log(userExists);
  if (userAlreadyExists) {
    const errors = [];

    if (userAlreadyExists.username === req.body.username) {
      errors.push({ field: "username", message: "Username already exists" });
    }

    if (userAlreadyExists.email === req.body.email) {
      errors.push({ field: "email", message: "Email already exists" });
    }

    // Retourner toutes les erreurs
    res.status(400).json({ errors });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const response = await UserModel.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    res.status(201).json(response);
  } catch (error) {
    console.error("Error writing to file:", error);
    res.status(500).json({ message: "Internal server error during the creation of the user" });
    return;
  }
};
