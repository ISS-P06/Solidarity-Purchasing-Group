"use strict";
import {listClients, listProducts, insertClient} from "./dao";
import express from 'express';
import morgan from 'morgan';
import { check, validationResult } from 'express-validator';
import VTC from './vtc';
import bcrypt from 'bcrypt'

/** Virtual Time Clock */
const vtc = new VTC();

/* express setup */
const app = new express();

app.use(express.json());
app.use(morgan('dev'));

/*** APIs ***/

app.get("/", (req, res) => {
    res.status(200).send("Hello World!")});
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
    const saltRounds = 10;
    bcrypt.hash(client.password , saltRounds,function (err, hash){
        insertClient(client.name, client.surname, client.phone, client.address, client.mail, client.balance, client.username, hash)
            .then(() => {
                res.end()
            })
            .catch(err => res.status(500).json(err))
    })
})

/*** End APIs ***/

export default app;
