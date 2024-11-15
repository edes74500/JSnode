import mongoose from "mongoose";
import EmployeeModel from "../model/Employee";

const MONGODB_URI = process.env.MONGODB_URI as string;
export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("L'URI de connexion MongoDB n'est pas définie.");
    }
    await mongoose.connect(MONGODB_URI, {});

    // Synchroniser les index
    console.log("Syncing indexes...");
    await EmployeeModel.syncIndexes();
    console.log("Indexes synced successfully");
  } catch (error) {
    console.error("Erreur lors de la connexion à MongoDB :", error);
    process.exit(1); // Arrête l'application en cas d'échec
  }
};
