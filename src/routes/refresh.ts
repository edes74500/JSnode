import express from "express";
import { refreshAccessToken } from "../controllers/refreshJWT.controller";
const router = express.Router();

router.get("/refresh-token", refreshAccessToken);

export default router;
