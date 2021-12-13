'use strict';

import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { basketDAO, orderDAO, clientDAO } from '../dao';
import { isLoggedIn, VTC } from '../utils';

export const router = Router();

const vtc = new VTC();

/**
 * ---
 * This file contains all BE routes used to get and post data about
 * the users' own baskets.
 * ---
 */

/**
 * POST
 *
 * Insert client's order on database, with the items on its basket.
 *
 * @param {number} userId - User id on database.
 */
router.post(
  '/api/client/:userId/basket/buy',
  isLoggedIn,
  [check('userId').isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const dateTime = vtc.formatTime();

    // NOTE: If one of these promise fails, it will immediatly raise
    // an exception and the next ones won't be executed.
    try {
      const basket = await basketDAO.getBasketByClientId(userId);
      const balance = await clientDAO.getBalanceByClientId(userId);

      // insert order
      const requestId = await orderDAO.insertOrderFromBasket(userId, basket, balance, dateTime);

      basket.forEach((p) => {
        // insert product info on table `Product_Request`
        orderDAO.insertProductRequest(requestId, p.productId, p.quantity);
        // clear basket
        basketDAO.removeProductFromBasket(userId, p.productId);
      });

      res.status(200).json(requestId);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

/**
 * DELETE
 *
 * Delete a product form basket.
 *
 * @param {number} userId - User id on database.
 * @param {number} productId - Product id on database.
 */
router.delete(
  '/api/client/:userId/basket/remove',
  isLoggedIn,
  [check('userId').isInt(), check('productId').isInt()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { productId } = req.body;

    basketDAO
      .removeProductFromBasket(userId, productId)
      .then((p) => res.json(p))
      .catch(() => res.status(500).end());
  }
);

/**
 * POST
 *
 * Insert a product into a basket.
 *
 * @param {number} userId - User id on database.
 * @param {number} productId - Product id on database.
 * @param {number} reservedQuantity - Quantity of product to reserve.
 */
router.post(
  '/api/client/:userId/basket/add',
  isLoggedIn,
  [check('userId').isInt(), check('productId').isInt(), check('reservedQuantity').isNumeric()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { productId, reservedQuantity } = req.body;

    basketDAO
      .addProductToBasket(userId, productId, reservedQuantity)
      .then((p) => res.json(p))
      .catch(() => res.status(500).end());
  }
);

/**
 * GET
 *
 * Retrive the entire user's basket.
 */
router.get('/api/client/:clientId/basket', isLoggedIn, (req, res) => {
  basketDAO
    .getBasketByClientId(req.params.clientId)
    .then((products) => res.json(products))
    .catch(() => res.status(500).end());
});
