import { db } from "../config/database.js";

export async function getCustomers(req, res) {
  try {
    const customers = await db.query("SELECT * FROM customers");
    res.status(200).send(customers.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getCustomersById(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id) || id <= 0) return res.send(400);

  try {
    const customers = await db.query(`SELECT * FROM customers WHERE id = $1`, [
      id,
    ]);

    if (!customers || customers.rowCount === 0) return res.sendStatus(404);

    res.status(200).send(customers.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function postCustomers(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const customers = await db.query("SELECT cpf FROM customers");

    if (customers.rows.find((customer) => customer.cpf === cpf))
      return res.send(409);

    const newCustomer = await db.query(
      `
      INSERT INTO customers (name,  phone, cpf, birthday)
      VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function putCustomers(req, res) {
  try {
  } catch {}
}
