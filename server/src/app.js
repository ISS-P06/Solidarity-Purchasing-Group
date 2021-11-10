"use strict";

import {listClients, listProducts, insertClient} from "./dao";

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

// ADD NEW CLIENT
// TODO PUT ISLOGGEDIN AS A MIDDLEWARE
app.post('/api/insert_client', async (req, res) => {
    let client = req.body;
    insertClient(client.name, client.surname, client.phone, client.address, client.mail, client.balance)
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