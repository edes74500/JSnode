import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import { logEmitter } from "./events/logEmitter";
import { logger } from "./middleware/logEvent";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import rootRoutes from "./routes/root";
import employeesRoutes from "./routes/api/employees";
import userRoutes from "./routes/register";
import refreshRoutes from "./routes/refresh";
import logoutRoutes from "./routes/logout";
import cookieParser from "cookie-parser";
import { verifJWT } from "./middleware/verifyJWT";
import { credential } from "./middleware/credential";
import { connectDB } from "./config/dbConn";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
connectDB();
app.use(logger);

// middleware pour utiliser CORS
app.use(credential);
app.use(cors(corsOptions));
// middleware pour parser les données en POST des forms
app.use(express.urlencoded({ extended: false }));
// middleware pour parser les données en JSON
app.use(express.json());
app.use(cookieParser());

//middleware pour servir le dossier public
app.use("/", express.static(path.join(__dirname, "..", "public")));

//routes handlers
app.use("/", rootRoutes);
app.use("/register", userRoutes);
app.use("/login", require("./routes/login"));
app.use("/logout", logoutRoutes);
app.use("/refresh", refreshRoutes);

// JWT token needed from here
app.use(verifJWT);
app.use("/employees", employeesRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
    logEmitter.emit("event", `Page not found: ${req.originalUrl}`, "error.log");
  } else if (req.accepts("json")) {
    res.json({ error: "Page not found" });
  } else {
    res.type("txt").send("Page not found");
  }
});

app.use(errorHandler);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    logEmitter.emit("event", "Server started", "server.log");
  });
});
