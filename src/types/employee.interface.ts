import { Document } from "mongoose";

interface Employee {
  name: string;
  email: string;
  age: number;
}

export interface IEmployee extends Employee, Document {}
