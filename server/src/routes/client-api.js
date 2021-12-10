'use strict';

import express from 'express';
import { check, validationResult } from 'express-validator';
import { clientDAO, orderDAO } from '../dao';
var router = express.Router();

// --- Client APIs --- //

/**
 * GET /api/clients
 * get the list of clients
 * @returns res.data: [{id,name,surname,address,balance,mail,phone}]
 */
router.get('/api/clients', (req, res) => {
    clientDAO.listClients()
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
    check('id').isInt(),
    check('amount').isInt({min: 5}),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({error: errors.array()});
        }

        const {id, amount} = req.body;

        try {
            clientDAO.updateClientBalance(id, amount);

            res.status(200).end();
        } catch (error) {
            res.status(500).json({error});
        }
    }
);

// GET /api/clients/:clientId/orders
router.get('/api/clients/:clientId/orders', (req, res) => {
    orderDAO.getOrders(req.params.clientId)
        .then((orders) => res.json(orders))
        .catch(() => res.status(500).end());
});

// GET /api/clients/:clientId/orders/:orderId
router.get('/api/clients/:clientId/orders/:orderId', (req, res) => {
    orderDAO.getOrderById(req.params.orderId, req.params.clientId)
        .then((orders) => res.json(orders))
        .catch(() => res.status(500).end());
});

// --- --- --- //

module.exports = router;
