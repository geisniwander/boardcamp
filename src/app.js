import express from "express";
import cors from "cors";
import gamesRouter from "./routes/GameRoutes";
import customersRouter from "./routes/CustomerRoutes";
import rentalsRouter from "./routes/RentalRoutes";

const server = express();

server.use(express.json());
server.use(cors());

server.use([gamesRouter, customersRouter, rentalsRouter]);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
