import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  age: {
    type: Number,
    required: true,
  },
});

// Création du modèle
const Employee = mongoose.model("Employee", EmployeeSchema);

// Exportation du modèle
export default Employee;
