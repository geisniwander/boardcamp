import {
  getCustomers,
  getCustomersById,
  postCustomers,
  putCustomers,
} from "../controller/Customers";
import { Router } from "express";
import { validateSchema } from "../middleware/ValidateSchema.js";
import { customerSchema } from "../schema/CustomerSchema";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersById);
customersRouter.post(
  "/customers",
  validateSchema(customerSchema),
  postCustomers
);
customersRouter.put("/customers/:id", putCustomers);

export default customersRouter;
