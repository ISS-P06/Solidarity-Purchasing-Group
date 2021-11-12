"use strict";

import { listClients, listProducts, insertOrder } from "./dao.js";

import express from 'express';
import morgan from 'morgan';
import {check,validationResult} from 'express-validator';
/* express setup */
const app = new express();

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format express-validate errors as strings
  return `${location}[${param}]: ${msg}`;
};

app.use(express.json());
app.use(morgan('dev'));

/*** APIs ***/

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

// GET /api/products
app.get('/api/products', (req, res) => {
  listProducts()
    .then((products) => res.json(products))
    .catch(() => res.status(500).end());
});

// GET /api/clients
app.get('/api/clients', (req, res) => {
  listClients()
    .then((clients) => res.json(clients))
    .catch(() => res.status(500).end());
});

app.post('/api/orders',
check('clientID').isInt(),
check('order').custom((value, { req }) => {
  for (const product of value) {
    console.log(Number.isInteger(product.quantity))
    if (!Number.isInteger(product.id) || !typeof product.quantity=== 'number' || isNaN(product.quantity)){
      return false;
  }
}
  return true;
}),(req, res) => {
  console.log(req.body);
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).json({ error: errors.array().join(", ")});
   
  }
  insertOrder(req.body)
    .then((id) => res.json(id))
    .catch(() => res.status(500).end());
});


/*** End APIs ***/

export default app;
