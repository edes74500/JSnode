import EventEmitter from "events";
import { format } from "date-fns";
import path from "path";
import fs from "fs";
import fsPromise from "fs/promises";
import { v4 as uuidv4 } from "uuid";

class MyEmitter extends EventEmitter {}

export const logEmitter = new MyEmitter();

logEmitter.on("event", async (message: string, fileName: string): Promise<void> => {
  const now: Date = new Date();
  const logDir = path.join(__dirname, "..", "..", "logs");
  const logFilePath = path.join(logDir, fileName);
  const formatedMessage = `${format(now, "yyyy-MM-dd HH:mm:ss")}\t${uuidv4()}\t${message}\n`;

  try {
    if (!fs.existsSync(logDir)) {
      await fsPromise.mkdir(logDir, { recursive: true });
    }
    await fsPromise.appendFile(logFilePath, formatedMessage);
  } catch (error) {
    console.error("Error writing to error.log:", error);
  }

  // console.log(`Event received: ${arg1}, ${arg2}`);
});
