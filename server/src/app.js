"use strict";

import {
  listClients,
  listProducts,
  insertOrder,
  updateClientBalance,
} from "./dao.js";

import express from "express";
import morgan from "morgan";
import { check, validationResult } from "express-validator";
import VTC from './vtc';

/** Virtual Time Clock */
const vtc = new VTC();

/* express setup */
const app = new express();

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format express-validate errors as strings
  return `${location}[${param}]: ${msg}`;
};

app.use(express.json());
app.use(morgan("dev"));

/*** APIs ***/

app.get("/", (req, res) => {
    res.status(200).send("Hello World!")});
/**
 * GET /api/time
 *
 * Used to pass current virtual time clock to the frontend.
 */
app.get('/api/time', (_, res) => {
  res.status(200).json({ currentTime: vtc.time(), day: vtc.day() });
});

/**
 * PUT /api/time
 *
 * Used to set current virtual time clock from the frontend.
 *
 * @param {string} time
 */
app.put('/api/time', [check('time').isISO8601()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const time = req.body.time;

  try {
    vtc.set(time);
    res.status(200).json({ currentTime: vtc.time(), day: vtc.day() });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// GET /api/products
app.get("/api/products", (req, res) => {
  listProducts()
    .then((products) => res.json(products))
    .catch(() => res.status(500).end());
});

// GET /api/clients
app.get("/api/clients", (req, res) => {
  listClients()
    .then((clients) => res.json(clients))
    .catch(() => res.status(500).end());
});

/**
 * PUT /api/clients/topup
 * 
 * Usade to update current client's balance.
 *
 * @param {int} id      Client id.
 * @param {int} amount  Amount of money to add on client's balance.
 */
app.put(
  "/api/clients/topup",
  check("id").isInt(),
  check("amount").isInt({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    }

    const {id, amount} = req.body;

    try {
      updateClientBalance(id, amount);

      res.status(200).end();
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

app.post(
  "/api/orders",
  check("clientID").isInt(),
  check("order").custom((value, { req }) => {
    for (const product of value) {
      console.log(Number.isInteger(product.quantity));
      if (
        !Number.isInteger(product.id) ||
        !typeof product.quantity === "number" ||
        isNaN(product.quantity)
      ) {
        return false;
      }
    }
    return true;
  }),
  (req, res) => {
    console.log(req.body);
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(422).json({ error: errors.array().join(", ") });
    }
    insertOrder(req.body)
      .then((id) => res.json(id))
      .catch(() => res.status(500).end());
  }
);

// ADD NEW CLIENT
// TODO PUT ISLOGGEDIN AS A MIDDLEWARE
app.post('/api/insert_client', async (req, res) => {
    let client = req.body;
    insertClient(client.name, client.surname, client.phone, client.address, client.mail, client.balance, client.username, client.password)
        .then((result) => {
            console.log(result)
            res.end()
        })
        .catch(err => res.status(500).json(err))
})

/*** End APIs ***/

export default app;
