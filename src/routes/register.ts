import express from "express";
import path from "path";
import { registerUser } from "../controllers/register.controller";

const router = express.Router();

router.route("/").post(registerUser);

export default router;
