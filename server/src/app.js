'use strict';

import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import { passportInit, passportSession } from './utils/passport';
import {
  userRouter,
  vtcRouter,
  productRouter,
  basketRouter,
  clientRouter,
  farmerRouter,
  orderRouter,
  managerRouter,
} from './routes';

/* express setup */
const app = new express();

app.use(express.json());
app.use(morgan('dev', { skip: () => process.env.NODE_ENV === 'test' }));

// set up the session
app.use(
  session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'sinfonia di sogliole siamesi',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
app.use(passportInit);
app.use(passportSession);

// serve static files on heroku
if (process.env.HEROKU) {
  app.use(express.static('../client/build'));
}

// VTC routes
app.use(vtcRouter);
// User routes
app.use(userRouter);
// Product routes
app.use(productRouter);
// Basket routes
app.use(basketRouter);
// Client routes
app.use(clientRouter);
// Farmer routes
app.use(farmerRouter);
// Order routes
app.use(orderRouter);
// Manager routes
app.use(managerRouter);

export default app;
