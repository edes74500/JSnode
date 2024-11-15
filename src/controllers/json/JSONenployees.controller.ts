import employees from "../model/employees.json";
import { Request, Response } from "express";

interface Employee {
  id: number;
  name: string;
  email: string;
  age: number;
}

interface Data {
  employees: Employee[];
}

const data: Data = {
  employees: employees,
};

export const getAllEmployees = (req: Request, res: Response): void => {
  res.json(data.employees);
};

export const createNewEmployee = (req: Request, res: Response): void => {
  const newEmployee: Employee = req.body;
  if (!newEmployee.name || !newEmployee.email || !newEmployee.age) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  const id = data.employees.length + 1;
  newEmployee.id = id;
  data.employees.push(newEmployee);
  res.status(201).json(data.employees);
  console.log("new employee created");
};

export const updateEmployee = (req: Request, res: Response): void => {
  const updatedEmployee: Employee = req.body;
  const employeeIndex = data.employees.findIndex((employee) => employee.id === updatedEmployee.id);
  if (employeeIndex !== -1) {
    data.employees[employeeIndex] = updatedEmployee;
    res.json(data.employees);
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
};

export const deleteEmploye = (req: Request, res: Response): void => {
  console.log("Corps de la requête :", req.body);

  const employeeId = req.body.id;
  const employeeIndex = data.employees.findIndex((employee) => employee.id === employeeId);
  if (employeeIndex !== -1) {
    data.employees.splice(employeeIndex, 1);
    res.json(data.employees);
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
};

export const getEmployeeById = (req: Request, res: Response): void => {
  const employeeId: number = parseInt(req.params.id, 10);
  const employee = data.employees.find((employee) => employee.id === employeeId);
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
};
