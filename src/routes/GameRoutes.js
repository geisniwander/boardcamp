import { getGames, postGames } from "../controller/Games";
import { Router } from "express";
import { validateSchema } from "../middleware/ValidateSchema.js";
import { gameSchema } from "../schema/GameSchema";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gameSchema), postGames);

export default gamesRouter;
