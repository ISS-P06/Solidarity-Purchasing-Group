'use strict';

import express from 'express';
import morgan from 'morgan';
import { check, validationResult } from 'express-validator';
import session from 'express-session';

// --- DAO imports: --- //
import { productDAO, farmerDAO, clientDAO, basketDAO, orderDAO } from './dao';

// --- Router imports: --- //
import { userRouter, vtcRouter, productRouter, basketRouter, clientRouter, farmerRouter, orderRouter } from './routes';

// --- Utility imports: --- //
import { passportUtil, formatterUtil, VTC } from './utils';

// --- --- --- //

const vtc = new VTC();

/* express setup */
const app = new express();

app.use(express.json());
app.use(morgan('dev', {skip: () => process.env.NODE_ENV === 'test'}));

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
// passport properties are defined in ./utils/passport
app.use(passportUtil.passportInit);
app.use(passportUtil.passportSession);

/*** APIs ***/

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

// --- Order APIs --- //

/**
 * POST /api/orders
 * Add a order of a client {clientID: client.id, order: order}
 */
app.post(
    '/api/orders',
    check('clientID').isInt(),
    check('order').custom((value, {req}) => {
        for (const product of value) {
            if (
                !Number.isInteger(product.id) ||
                !typeof product.quantity == 'number' ||
                isNaN(product.quantity)
            ) {
                return false;
            }
        }
        return true;
    }),
    (req, res) => {
        const errors = validationResult(req).formatWith(formatterUtil.errorFormatter);
        if (!errors.isEmpty()) {
            return res.status(422).json({error: errors.array().join(', ')});
        }
        orderDAO.insertOrder(req.body)
            .then((id) => res.json(id))
            .catch(() => res.status(500).end());
    }
);

// GET /api/orders
app.get('/api/orders', (req, res) => {
    orderDAO.getOrders()
        .then((orders) => res.json(orders))
        .catch(() => res.status(500).end());
});

// GET /api/orders/:id
// Route used to get the order review
app.get('/api/orders/:id', (req, res) => {
    orderDAO.getOrderById(req.params.id)
        .then((order) => {
            res.json(order);
        })
        .catch(() => {
            res.status(500).end();
        });
});

// POST /api/orders/:id/deliver
app.post('/api/orders/:id/deliver', (req, res) => {
    orderDAO.setOrderDelivered(req.params.id)
        .then((orderId) => {
            res.json(orderId);
        })
        .catch(() => res.status(500).end());
});

// --- Basket APIs --- //

/**
 * POST
 *
 * Insert client's order on database, with the items on its basket.
 * 
 * @param {number} userId - User id on database
 */
app.post('/api/client/:userId/basket/buy', [check('userId').isInt()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const {userId} = req.params;
    const dateTime = vtc.formatTime();

  // NOTE: If one of these promise fails, it will immediatly raise
  // an exception and the next ones won't be executed.
  try {
    const basket = await basketDAO.getBasketByClientId(userId);
    const balance = await clientDAO.getBalanceByClientId(userId);

        // insert order
        await orderDAO.insertOrderFromBasket(userId, basket, balance, dateTime);

        // clear basket
        basket.forEach((p) => basketDAO.removeProductFromBasket(userId, p.productId));

        res.status(200).json({});
    } catch (e) {
        res.status(500).json(e);
    }
});

app.delete(
    '/api/client/:userId/basket/remove',
    [check('userId').isInt(), check('productId').isInt()],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const {userId} = req.params;
        const {productId} = req.body;

        basketDAO.removeProductFromBasket(userId, productId)
            .then((productId) => res.json(productId))
            .catch(() => res.status(500).end());
    }
);

app.post(
    '/api/client/:userId/basket/add',
    [check('userId').isInt(), check('productId').isInt(), check('reservedQuantity').isNumeric()],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const {userId} = req.params;
        const {productId, reservedQuantity} = req.body;

        basketDAO.addProductToBasket(userId, productId, reservedQuantity)
            .then((productId) => res.json(productId))
            .catch(() => res.status(500).end());
    }
);

// GET /api/clients/:clientId/basket
app.get('/api/client/:clientId/basket', (req, res) => {
    basketDAO.getBasketByClientId(req.params.clientId)
        .then((products) => res.json(products))
        .catch(() => res.status(500).end());
});

// --- --- --- //

/*** Farmer APIs **/
/**
 * GET
 *
 * Get all the products supplied the next week linked by a farmer with {userId}
 */
app.get('/api/farmer/:farmerId/products/supplied', [check('farmerId').isInt()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    farmerDAO.listSuppliedFarmerProducts(req.params.farmerId)
        .then((products) => res.json(products))
        .catch(() => res.status(500).end());
});
/**
 * GET
 *
 * Get all the products linked to a farmer with {userId}
 */
app.get('/api/farmer/:farmerId/products', [check('farmerId').isInt()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    farmerDAO.listFarmerProducts(req.params.farmerId)
        .then((products) => res.json(products))
        .catch(() => res.status(500).end());
});

/**
 * POST
 *
 * Add expected available product amounts for the next week
 */
app.post('/api/farmer/products/available', [check('productID').isInt(), check('quantity').isNumeric(), check('price').isNumeric()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    productDAO.addExpectedAvailableProduct(req.body)
        .then((products) => res.json(products))
        .catch(() => res.status(500).end());
});

/**
 * DELETE
 *
 * DELETE expected available product {productID} amounts for the next week
 */
app.delete('/api/farmer/products/available', [check('productID').isInt()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    productDAO.removeExpectedAvailableProduct(req.body)
        .then((productID) => res.json(productID))
        .catch(() => res.status(500).end());
});

/**
 * post
 * INSERT a new product description
 */
app.post('/api/insert_product_description', (req ,res)=>{
    productDAO.insertProductDescription(req.body)
        .then(() => res.end())
        .catch(() => res.status(500).end());
})

/*** End APIs ***/

export default app;
