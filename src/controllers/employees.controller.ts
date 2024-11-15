import { Request, Response } from "express";
import EmployeeModel from "../model/Employee";
import { IEmployee } from "../types/employee.interface";

export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const allEmployees = await EmployeeModel.find();
    res.json(allEmployees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "An error occurred while fetching all employees." });
  }
};

export const createNewEmployee = async (req: Request, res: Response): Promise<void> => {
  if (!req.body.name || !req.body.email || !req.body.age) {
    console.error("Missing required fields for new employee.");
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  try {
    // await EmployeeModel.collection.dropIndexes(); // Supprime tous les index existants
    // await EmployeeModel.syncIndexes(); // Recrée les index définis dans le schéma
    const newEmployee: IEmployee = await EmployeeModel.create(req.body);
    res.status(201).json(newEmployee);
    console.log("new employee created");
  } catch (error: any) {
    // Vérifiez si l'erreur est une duplication
    if (error.code === 11000 && error.keyPattern?.email) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      console.error("Error creating new employee:", error);
      res.status(500).json({ message: "An error occurred while creating the employee" });
    }
  }
};

export const updateEmployeeById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // Vérifiez si un ID est fourni
  if (!id) {
    res.status(400).json({ message: "Missing employee ID" });
    return;
  }

  // Vérifiez si des données sont fournies pour la mise à jour
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "No data provided for update" });
    return;
  }

  try {
    const updatedEmployee: IEmployee | null = await EmployeeModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedEmployee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An error occurred while updating the employee" });
    }
  }
};

export const deleteEmployeById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  // Vérifiez si un ID est fourni
  if (!id) {
    res.status(400).json({ message: "Missing employee ID" });
    return;
  }
  try {
    const deletedEmployee: IEmployee | null = await EmployeeModel.findByIdAndDelete(id);

    if (!deletedEmployee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    res.status(200).json({ message: "Employee deleted", employee: deletedEmployee });
    console.log("Employee deleted:", deletedEmployee);
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "An error occurred while deleting the employee" });
  }
};

export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  // Vérifiez si un ID est fourni
  if (!id) {
    res.status(400).json({ message: "Missing employee ID" });
    return;
  }
  try {
    const employee: IEmployee | null = await EmployeeModel.findById(id);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "An error occurred while fetching the employee" });
  }
};
