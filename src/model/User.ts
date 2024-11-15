import mongoose from "mongoose";
import IUser from "../types/user.interface";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    USER: {
      type: Number,
      default: 1,
    },
    ADMIN: Number,
    EDITOR: Number,
  },
  refreshToken: String,
});

const User = mongoose.model<IUser>("User", UserSchema);

// Exportation du modèle
export default User;
