import { Response, Request } from "express";
import UserModel from "../model/User";

export const logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    res.status(400).json({ error: "No refresh token provided." });
    return;
  }

  try {
    // Rechercher l'utilisateur par le refresh token
    const user = await UserModel.findOne({ refreshToken });

    if (!user) {
      // Si l'utilisateur n'est pas trouvé, effacez quand même le cookie pour des raisons de sécurité
      res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });
      console.log("Refresh token not associated with any user, but cookie cleared.");
      res.status(200).json({ message: "User not found, but cookie cleared." });
      return;
    }

    // Supprimez le refresh token de la base de données
    user.refreshToken = undefined;
    await user.save();

    // Effacer le cookie
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });
    console.log("JWT cookie cleared and refresh token removed.");
    res.status(200).json({ message: "User logged out successfully." });
  } catch (error: any) {
    console.error("Error logging out:", error.message);
    res.status(500).json({ message: "Internal server error while logging out." });
  }
};
