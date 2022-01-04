'use strict';

import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { productDAO, farmerDAO } from '../dao';
import { isLoggedIn_Farmer, VTC } from '../utils';
import { sendNewProductMessage } from '../telegram';

const vtc = new VTC();

export const router = Router();

/**
 * ---
 * This file contains all BE routes used to get and post data about
 * the site's farmers (which are a subset of the site's users, with
 * specific priviledges and permissions).
 * ---
 */

/**
 * GET
 *
 * Get all the products supplied the next week linked by a farmer with {userId}
 */
router.get(
  '/api/farmer/:farmerId/products/supplied',
  isLoggedIn_Farmer,
  [check('farmerId').isInt()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let currTime = new Date(vtc.time());
    let wednesday = currTime;

    while (wednesday.getDay() != 3) {
      wednesday.setDate(wednesday.getDate() - 1);
    }

    farmerDAO
      .listSuppliedFarmerProducts(req.params.farmerId, wednesday)
      .then((products) => res.json(products))
      .catch(() => res.status(500).end());
  }
);
/**
 * GET
 *
 * Get all the products linked to a farmer with {userId}
 */
router.get(
  '/api/farmer/:farmerId/products',
  isLoggedIn_Farmer,
  [check('farmerId').isInt()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    farmerDAO
      .listFarmerProducts(req.params.farmerId)
      .then((products) => res.json(products))
      .catch(() => res.status(500).end());
  }
);

/**
 * POST
 *
 * Add expected available product amounts for the next week
 */
router.post(
  '/api/farmer/products/available',
  isLoggedIn_Farmer,
  [check('productID').isInt(), check('quantity').isNumeric(), check('price').isNumeric()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const product = await productDAO.addExpectedAvailableProduct(req.body);
      const prod_descr = await productDAO.getProductByID(product.productID);

      // send a notificaton on the telegram channel
      sendNewProductMessage({ ...prod_descr, ...product });

      res.json(product);
    } catch {
      res.status(500).end();
    }
  }
);

/**
 * DELETE
 *
 * DELETE expected available product {productID} amounts for the next week
 */
router.delete(
  '/api/farmer/products/available',
  isLoggedIn_Farmer,
  [check('productID').isInt()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    productDAO
      .removeExpectedAvailableProduct(req.body)
      .then((productID) => res.json(productID))
      .catch(() => res.status(500).end());
  }
);
