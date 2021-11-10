"use strict";

import { request } from "http";
import { getOrders, getOrderById, setOrderDelivered } from "./dao";

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
  getOrders()
    .then((orders) => res.json(orders))
    .catch(() => res.status(500).end());
});

// GET /api/orders/:id
// Route used to get the order review
app.get('/api/orders/:id', (req, res) => {
  getOrderById(req.params.id)
    .then((order) => {console.log(order); res.json(order)})
    .catch(() => res.status(500).end());
});

// POST /api/orders/:id/deliver
app.post('/api/orders/:id/deliver', (req, res) => {
  setOrderDelivered(req.params.id)
    .then((orderId) => {console.log(orderId); res.json(orderId)})
    .catch(() => res.status(500).end());
});

/*** End APIs ***/

export default app;
