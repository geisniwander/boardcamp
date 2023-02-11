import { deleteRentals, getRentals, postEndRentals, postRentals } from "../controller/Rentals";
import { Router } from "express";
import { validateSchema } from "../middleware/ValidateSchema.js";
import { rentalSchema } from "../schema/RentalSchema";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateSchema(rentalSchema), postRentals);
rentalsRouter.post("/rentals/:id/return", postEndRentals);
rentalsRouter.delete("/rentals/:id", deleteRentals);

export default rentalsRouter;
