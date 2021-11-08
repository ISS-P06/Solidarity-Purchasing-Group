"use strict";

const express = require("express");

/* express setup */
const app = new express();

app.use(express.json());

/*** APIs ***/

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});




/*** End APIs ***/

export default app;
