'use strict';

import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { productDAO, farmerDAO } from '../dao';
import { isLoggedIn } from '../utils/passport';

const router = Router();

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
router.get('/api/farmer/:farmerId/products/supplied', [check('farmerId').isInt()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  farmerDAO
    .listSuppliedFarmerProducts(req.params.farmerId)
    .then((products) => res.json(products))
    .catch(() => res.status(500).end());
});

/**
 * GET
 *
 * Get all the products linked to a farmer with {userId}
 */
router.get('/api/farmer/:farmerId/products', [check('farmerId').isInt()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  farmerDAO
    .listFarmerProducts(req.params.farmerId)
    .then((products) => res.json(products))
    .catch(() => res.status(500).end());
});

/**
 * POST
 *
 * Add expected available product amounts for the next week
 */
router.post(
  '/api/farmer/products/available',
  [check('productID').isInt(), check('quantity').isNumeric(), check('price').isNumeric()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    productDAO
      .addExpectedAvailableProduct(req.body)
      .then((products) => res.json(products))
      .catch(() => res.status(500).end());
  }
);

/**
 * DELETE
 *
 * DELETE expected available product {productID} amounts for the next week
 */
router.delete('/api/farmer/products/available', [check('productID').isInt()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  productDAO
    .removeExpectedAvailableProduct(req.body)
    .then((productID) => res.json(productID))
    .catch(() => res.status(500).end());
});

export default router;
