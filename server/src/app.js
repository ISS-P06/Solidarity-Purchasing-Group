<<<<<<< HEAD
"use strict";

import {listClients, listProducts, insertClient} from "./dao";
=======
'use strict';
>>>>>>> main

import express from 'express';
import morgan from 'morgan';

import { check, validationResult } from 'express-validator';

import { listClients, listProducts } from './dao';
import VTC from './vtc';

/** Virtual Time Clock */
const vtc = new VTC();

/* express setup */
const app = new express();

app.use(express.json());
app.use(morgan('dev'));

/*** APIs ***/

<<<<<<< HEAD
app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
=======
/**
 * GET /api/time
 *
 * Used to pass current virtual time clock to the frontend
 */
app.get('/api/time', (_, res) => {
  res.status(200).json({ currentTime: vtc.time(), day: vtc.day() });
});

/**
 * PUT /api/time
 *
 * Used to set current virtual time clock from the frontend
 *
 * @param {time}
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
>>>>>>> main
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
/*  try {
    await insertClient(client.name, client.surname, client.phone, client.address, client.mail, client.balance)
    res.end();
  }catch (err){
    res.status(500).json(err);
  }*/