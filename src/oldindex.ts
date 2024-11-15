import http from "http";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";
import { log } from "console";
import { logEmitter } from "./events/logEmitter";
console.log("App started");
logEmitter.emit("event", "App started", "appStarted.log");

const PORT = process.env.PORT || 3500;

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  console.log("req url", req.url, "req method ", req.method);

  if (!req.url) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Bad Request");
    return;
  }
  const extension = path.extname(req.url);

  let contentType;

  switch (extension) {
    case ".json":
      contentType = "application/json";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".gif":
      contentType = "image/gif";
      break;
    default:
      contentType = "text/html";
  }

  let filePath;

  if (contentType === "text/html" && req.url === "/") {
    filePath = path.join(__dirname, "views", "index.html");
    console.log("content type", contentType, "file path", filePath);
  } else if (contentType === "text/html" && req.url.slice(-1) === "/") {
    console.log("test");
    filePath = path.join(__dirname, "views", req.url, "index.html"); // Au lieu de 404.html
  } else if (contentType === "text/html") {
    logEmitter.emit("event", `Request received for ${req.url}`, "requests.log");
    filePath = path.join(__dirname, "views", req.url);
  } else {
    filePath = path.join(__dirname, req.url);
  }

  if (!extension && req.url.slice(-1) !== "/") {
    filePath += ".html"; // Ajoute `.html` si aucune extension n'est présente
  }

  try {
    const data = await fsPromises.readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error: any) {
    console.error("Error reading file:", error);
    logEmitter.emit("event", `Error reading file: ${error?.message || "Unknown error"}`, "error.log");
    res.writeHead(404, { "Content-Type": "text/html" });
    const errorPagePath = path.join(__dirname, "views", "404.html");
    try {
      const errorPage = await fsPromises.readFile(errorPagePath);
      res.end(errorPage);
    } catch (error404: any) {
      console.error("Error reading 404 page:", error404.message);
      res.end("<h1>404 - File Not Found</h1>");
    }
  }
});

server.listen(PORT, () => {
  console.log("server is running on port", PORT);
});
