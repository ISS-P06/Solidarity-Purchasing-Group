'use strict';

import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { productDAO } from '../dao';
import { VTC, isLoggedIn, isLoggedIn_Farmer } from '../utils';

export const router = Router();

/** Virtual Time Clock */
const vtc = new VTC();

/**
 * GET /api/products
 * get the list of products
 * @returns product: [{id,name,description,category,name,price,quantity,unit, ref_farmer, farm_name}]
 */
router.get('/api/products', isLoggedIn, (_, res) => {
  let currTime = new Date(vtc.time());
  let wednesday = currTime;

  while (wednesday.getDay() != 3) {
    wednesday.setDate(wednesday.getDate() - 1);
  }

  productDAO
    .listProducts(wednesday)
    .then((products) => res.json(products))
    .catch(() => res.status(500).end());
});

/**
 * POST
 *
 * INSERT a new product description
 */
router.post(
  '/api/insert_product_description',
  isLoggedIn_Farmer,
  [
    check('name').isString(),
    check('description').isString(),
    check('category').isString(),
    check('unit').isString(),
    check('ref_farmer').isInt(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const description = req.body;

    productDAO
      .insertProductDescription(description)
      .then(() => res.status(200).end())
      .catch(() => res.status(500).end());
  }
);
