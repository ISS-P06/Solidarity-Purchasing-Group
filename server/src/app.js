"use strict";

import { listClients, listProducts, insertOrder } from "./dao.js";

import express from 'express';
import morgan from 'morgan';

/* express setup */
const app = new express();

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

app.post('/api/orders', (req, res) => {
  insertOrder(req.body)
    .then((id) => res.json(id))
    .catch(() => res.status(500).end());
});


/*** End APIs ***/

export default app;
