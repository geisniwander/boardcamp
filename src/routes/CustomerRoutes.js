import {
  getCustomers,
  getCustomersById,
  postCustomers,
  putCustomers,
} from "../controller/Customers.js";
import { Router } from "express";
import { validateSchema } from "../middleware/ValidateSchema.js";
import { customerSchema } from "../schema/CustomerSchema.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersById);
customersRouter.post(
  "/customers",
  validateSchema(customerSchema),
  postCustomers
);
customersRouter.put(
  "/customers/:id",
  validateSchema(customerSchema),
  putCustomers
);

export default customersRouter;
