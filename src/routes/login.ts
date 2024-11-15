import express from "express";
import { handleLogin } from "../controllers/login.controller";
const router = express.Router();

router.route("/").post(handleLogin);

module.exports = router;
