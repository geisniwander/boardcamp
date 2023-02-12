import dayjs from "dayjs";
import { db } from "../config/database.js";

export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`SELECT json_build_object(
      'id', rentals.id,
      'customerId', rentals."customerId",
      'gameId', rentals."gameId",
      'rentDate', rentals."rentDate",
      'daysRented', rentals."daysRented",
      'returnDate', rentals."returnDate",
      'originalPrice', rentals."originalPrice",
      'delayFee', rentals."delayFee",
      'customer', json_build_object(
        'id', customers.id,
        'name', customers.name
      ),
      'game', json_build_object(
        'id', games.id,
        'name', games.name
      )
    )
    FROM rentals
    JOIN customers
      ON rentals."customerId" = customers.id
    JOIN games
      ON rentals."gameId" = games.id
    `);

    const arrayRentals = rentals.rows.map((row) => row.json_build_object);

    res.status(200).send(arrayRentals);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id = $1`, [
      customerId,
    ]);

    const game = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId]);

    const rentals = await db.query(
      `SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL`,
      [gameId]
    );

    if (
      !customer ||
      customer.rowCount === 0 ||
      !game ||
      game.rowCount === 0 ||
      rentals.rowCount >= game.rows[0].stockTotal
    )
      return res.sendStatus(400);

    const originalPrice = game.rows[0].pricePerDay * daysRented;
    const rentDate = dayjs().format("YYYY/MM/DD");

    const newRental = await db.query(
      `
      INSERT INTO rentals ("customerId", "gameId", "rentDate", 
      "daysRented", "returnDate", "originalPrice","delayFee")
      VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function postEndRentals(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id) || id <= 0) return res.send(400);

  try {
    let rental = await db.query("SELECT * FROM rentals WHERE id = $1", [id]);
    rental = rental.rows[0];

    if (!rental || rental.rowCount === 0) return res.sendStatus(404);

    if (rental.returnDate != null) return res.sendStatus(400);

    const date = dayjs().format("YYYY/MM/DD");
    const today = dayjs(dayjs().format("YYYY/MM/DD"));
    const pastDays = today.diff(rental.rentDate, "day");
    let delayFee = 0;

    if (pastDays > rental.daysRented) {
      const days = pastDays - rental.daysRented;
      delayFee = days * rental.originalPrice;
    }

    const rentalEdited = await db.query(
      `
      UPDATE rentals 
      SET 
      "customerId" = $1,
      "gameId" = $2,
      "rentDate" = $3, 
      "daysRented" = $4,
      "returnDate" = $5, 
      "originalPrice" = $6,
      "delayFee" = $7
      WHERE id = $8;
      ;`,
      [
        rental.customerId,
        rental.gameId,
        rental.rentDate,
        rental.daysRented,
        date,
        rental.originalPrice,
        delayFee,
        id,
      ]
    );

    if (!rentalEdited || rentalEdited.rowCount === 0)
      return res.sendStatus(404);

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function deleteRentals(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id) || id <= 0) return res.send(400);

  try {
    const rental = await db.query("SELECT * FROM rentals WHERE id = $1", [id]);

    if (!rental || rental.rowCount === 0) return res.sendStatus(404);

    if (rental.rows[0].returnDate == null) return res.sendStatus(400);

    const deletedRental = await db.query("DELETE FROM rentals WHERE id = $1", [
      id,
    ]);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
