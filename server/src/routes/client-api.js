'use strict';

import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { clientDAO, orderDAO } from '../dao';
import { isLoggedIn } from '../utils/passport';

export const router = Router();

/**
 * ---
 * This file contains all BE routes used to get and post data about
 * the site's clients (which are a subset of the site's users, with
 * specific priviledges and permissions).
 * ---
 */

/**
 * GET /api/clients
 * get the list of clients
 * @returns res.data: [{id,name,surname,address,balance,mail,phone}]
 */
router.get('/api/clients', isLoggedIn, (_, res) => {
  clientDAO
    .listClients()
    .then((clients) => res.json(clients))
    .catch(() => res.status(500).end());
});

/**
 * PUT /api/clients/topup
 *
 * Used to update current client's balance.
 *
 * @param {int} id      Client id.
 * @param {int} amount  Amount of money to add on client's balance.
 */
router.put(
  '/api/clients/topup',
  isLoggedIn,
  check('id').isInt(),
  check('amount').isInt({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    }

    const { id, amount } = req.body;

    try {
      clientDAO.updateClientBalance(id, amount);

      res.status(200).end();
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

// GET /api/clients/:clientId/orders
router.get('/api/clients/:clientId/orders', isLoggedIn, (req, res) => {
  orderDAO
    .getOrders(req.params.clientId)
    .then((orders) => res.json(orders))
    .catch(() => res.status(500).end());
});

// GET /api/clients/:clientId/orders/:orderId
router.get('/api/clients/:clientId/orders/:orderId', isLoggedIn, (req, res) => {
  orderDAO
    .getOrderById(req.params.orderId, req.params.clientId)
    .then((orders) => res.json(orders))
    .catch(() => res.status(500).end());
});
