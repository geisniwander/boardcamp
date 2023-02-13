import { db } from "../config/database.js";

export async function getCustomers(req, res) {
  const { cpf, offset, limit } = req.query;

  try {
    let customers = undefined;
    if (cpf)
      customers = await db.query(`SELECT * FROM customers WHERE cpf LIKE $1 `, [
        cpf + "%",
      ]);
    else
      customers = await db.query("SELECT * FROM customers OFFSET $1 LIMIT $2", [
        offset || 0,
        limit,
      ]);
    res.status(200).send(customers.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getCustomersById(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id) || id <= 0) return res.send(400);

  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id = $1`, [
      id,
    ]);

    if (!customer || customer.rowCount === 0) return res.sendStatus(404);

    res.status(200).send(customer.rows[0]);
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
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;

  if (!id || isNaN(id) || id <= 0) return res.send(400);

  try {
    const customers = await db.query("SELECT cpf, id FROM customers");

    if (
      customers.rows.find(
        (customer) => customer.cpf === cpf && customer.id != id
      )
    )
      return res.send(409);

    const customerEdited = await db.query(
      `
      UPDATE customers 
      SET
        name = $1,
        phone = $2,
        cpf = $3, 
        birthday = $4
      WHERE id = $5;`,
      [name, phone, cpf, birthday, id]
    );

    if (!customerEdited || customerEdited.rowCount === 0)
      return res.sendStatus(404);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
