"use strict";

import { listOrders } from "./dao";

const express = require("express");

/* express setup */
const app = new express();

app.use(express.json());

/*** APIs ***/

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
  listOrders()
    .then((orders) => res.json(orders))
    .catch(() => res.status(500).end());
});


/*** End APIs ***/

export default app;
