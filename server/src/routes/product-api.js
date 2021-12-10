'use strict';

import express from 'express';
import { check, validationResult } from 'express-validator';
import { productDAO } from '../dao';
var router = express.Router();

// --- Import and initialize utility classes: --- //
import VTC from '../vtc';
/** Virtual Time Clock */
const vtc = new VTC();

// --- Product APIs --- //

/**
 * GET /api/products
 * get the list of products
 * @returns product: [{id,name,description,category,name,price,quantity,unit, ref_farmer, farm_name}]
 */
router.get('/api/products', (req, res) => {
    let currTime = new Date(vtc.time());
    let wednesday = currTime;

    while(wednesday.getDay() != 3) {
        wednesday.setDate(wednesday.getDate() - 1);
    }

    productDAO.listProducts(wednesday)
        .then((products) => res.json(products))
        .catch(() => res.status(500).end());
});

// --- --- --- //

module.exports = router;
