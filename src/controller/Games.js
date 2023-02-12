import { db } from "../config/database.js";

export async function getGames(req, res) {
  try {
  } catch {}
}

export async function postGames(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;

  try {
    const games = await db.query("SELECT name FROM games");

    if (games.rows.find((game) => game.name === name)) return res.send(409);

    const newGame = await db.query(
      `
      INSERT INTO games (name, image, "stockTotal", "pricePerDay")
      VALUES ($1, $2, $3, $4);`,
      [name, image, stockTotal, pricePerDay]
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
