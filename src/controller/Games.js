import format from "pg-format";
import { db } from "../config/database.js";

export async function getGames(req, res) {
  const { name, offset, limit, order, desc } = req.query;

  try {
    let games = undefined;
    if (name)
      games = await db.query(`SELECT * FROM games WHERE upper(name) LIKE $1 `, [
        name.toUpperCase() + "%",
      ]);
    else {
      if (order) {
        if (desc === "true")
          games = await db.query(
            format("SELECT * FROM games ORDER BY %I %s", order, "DESC")
          );
        else
          games = await db.query(
            format("SELECT * FROM games ORDER BY %I %s", order, "ASC")
          );
      } else
        games = await db.query(`SELECT * FROM games OFFSET $1 LIMIT $2`, [
          offset || 0,
          limit,
        ]);
    }
    res.status(200).send(games.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
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
