import { db } from "../config/database.js";

export async function getCustomers(req, res) {
  try {
  } catch {}
}

export async function getCustomersById(req, res) {
  try {
  } catch {}
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
