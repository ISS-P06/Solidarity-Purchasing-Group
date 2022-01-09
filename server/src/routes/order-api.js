'use strict';

import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { orderDAO } from '../dao';
import { isLoggedIn_Employee, isLoggedIn_Client, formatterUtil } from '../utils';

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
  isLoggedIn_Employee,
  (req, res) => {
    const errors = validationResult(req).formatWith(formatterUtil.errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(', ') });
    }
    orderDAO
      .insertOrder(req.body)
      .then((id) => res.json(id))
      .catch((e) => res.status(500).json(e));
  }
);

/**
 * Schedule bag delivery
 * req.params ID of the order
 * req.body: information about the delivery {address, date, time}
 */

router.post(
  '/api/orders/:orderId/deliver/schedule',
  isLoggedIn_Client,
  check('orderId').isInt(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    orderDAO
      .scheduleOrderDeliver(req.params.orderId, req.body)
      .then((orderId) => {
        res.json(orderId);
      })
      .catch(() => res.status(500).end());
  }
);

// POST /api/orders/:id/deliver
router.post('/api/orders/:id/deliver', isLoggedIn_Employee, (req, res) => {
  orderDAO
    .setOrderStatus(req.params.id, 'delivered')
    .then((orderId) => res.json(orderId))
    .catch(() => res.status(500).end());
});

// GET /api/orders
router.get('/api/orders', isLoggedIn_Employee, (_, res) => {
  orderDAO
    .getOrders()
    .then((orders) => res.json(orders))
    .catch(() => res.status(500).end());
});

// GET /api/orders/:id
// Route used to get the order review
router.get('/api/orders/:id', isLoggedIn_Employee, (req, res) => {
  orderDAO
    .getOrderById(req.params.id)
    .then((order) => {
      res.json(order);
    })
    .catch(() => {
      res.status(500).end();
    });
});
