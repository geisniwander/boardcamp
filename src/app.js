import express from "express";
import cors from "cors";
import gamesRouter from "./routes/GameRoutes.js";
import customersRouter from "./routes/CustomerRoutes.js";
import rentalsRouter from "./routes/RentalRoutes.js";

const server = express();

server.use(express.json());
server.use(cors());

server.use([gamesRouter, customersRouter, rentalsRouter]);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
