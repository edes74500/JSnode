import express from "express";
import { verifyRoles } from "./../../middleware/VerifyRoles";
import {
  getAllEmployees,
  createNewEmployee,
  deleteEmployeById,
  getEmployeeById,
  updateEmployeeById,
} from "../../controllers/employees.controller";
import { ROLES_LIST } from "../../config/roles_list";

const router = express.Router();

router
  .route("/")
  .get(verifyRoles([ROLES_LIST.ADMIN]), getAllEmployees)
  .post(verifyRoles([ROLES_LIST.ADMIN]), createNewEmployee);

router.route("/:id").get(getEmployeeById).put(updateEmployeeById).delete(deleteEmployeById);

export default router;
