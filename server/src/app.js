"use strict";

import { listProducts } from "../dao";

const express = require("express");
const morgan = require("morgan");

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

/*** End APIs ***/

export default app;
