import express from "express";
import path from "path";

const router = express.Router();

router.get("^/$|index(.html)?", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.get("/new-page(.html)?", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

router.get("/old-page(.html)?", (req, res) => {
  res.status(301).redirect("/new-page.html");
});

export default router;
