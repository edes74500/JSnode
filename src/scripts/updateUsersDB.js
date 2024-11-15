import mongoose from "mongoose";
import UserModel from "../model/User.js";

const updateRolesField = async () => {
  try {
    // Connexion à la base de données

    // Trouver tous les documents avec l'ancien champ `role`
    const usersToUpdate = await UserModel.find({ role: { $exists: true } });

    for (const user of usersToUpdate) {
      // Créez le champ `roles` à partir de `role`
      const roles = {
        USER: user.role === 1 ? 1 : 0, // Assurez-vous que cette logique reflète vos besoins
        ADMIN: user.role === 3 ? 3 : undefined,
        EDITOR: user.role === 2 ? 2 : undefined,
      };

      // Mettez à jour le document
      await UserModel.updateOne(
        { _id: user._id },
        {
          $set: { roles },
          $unset: { role: "" }, // Supprimez l'ancien champ `role`
        },
      );
      console.log(`Updated user with ID: ${user._id}`);
    }

    console.log("All users updated successfully");
  } catch (error) {
    console.error("Error updating users:", error);
  } finally {
    // Fermer la connexion à MongoDB
    mongoose.connection.close();
  }
};

updateRolesField();
