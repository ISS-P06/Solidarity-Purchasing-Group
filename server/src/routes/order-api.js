'use strict';

import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { orderDAO } from '../dao';
import { isLoggedIn, formatterUtil } from '../utils';

export const router = Router();

/**
 * ---
 * This file contains all BE routes used to get and post data about
 * the site's orders.
 * ---
 */

/**
 * POST /api/orders
 * Add a order of a client {clientID: client.id, order: order}
 */
router.post(
  '/api/orders',
  check('clientID').isInt(),
  check('order').custom(
    (value) =>
      !value.filter(
        (p) => !Number.isInteger(p.id) || !typeof p.quantity == 'number' || isNaN(p.quantity)
      ).length
  ),
  isLoggedIn,
  (req, res) => {
    const errors = validationResult(req).formatWith(formatterUtil.errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(', ') });
    }
    orderDAO
      .insertOrder(req.body)
      .then((id) => res.json(id))
      .catch(() => res.status(500).end());
  }
);

// GET /api/orders
router.get('/api/orders', isLoggedIn, (_, res) => {
  orderDAO
    .getOrders()
    .then((orders) => res.json(orders))
    .catch(() => res.status(500).end());
});

// GET /api/orders/:id
// Route used to get the order review
router.get('/api/orders/:id', isLoggedIn, (req, res) => {
  orderDAO
    .getOrderById(req.params.id)
    .then((order) => {
      res.json(order);
    })
    .catch(() => {
      res.status(500).end();
    });
});

// POST /api/orders/:id/deliver
router.post('/api/orders/:id/deliver', isLoggedIn, (req, res) => {
  orderDAO
    .setOrderDelivered(req.params.id)
    .then((orderId) => {
      res.json(orderId);
    })
    .catch(() => res.status(500).end());
});
