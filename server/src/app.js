'use strict';
import express from 'express';
import morgan from 'morgan';
import {check, validationResult} from 'express-validator';
import passport from 'passport';
import session from 'express-session';
import LocalStrategy from 'passport-local';

import {
    listClients,
    listProducts,
    insertOrder,
    updateClientBalance,
    insertClient,
    getOrders,
    getOrderById,
    setOrderDelivered,
    registerUser,
} from './dao.js';

import VTC from './vtc.js';
// --- Imports for passport and login/logout --- //
import {getUser, getUserById} from './user-dao.js';

/** Virtual Time Clock */
const vtc = new VTC();

// --- Set up Passport --- //
/*
    set up "username and password" strategy
*/
passport.use(
    new LocalStrategy(function (username, password, done) {
        getUser(username, password)
            .then((user) => {
                if (!user) return done(null, false, {message: 'Incorrect email and/or password.'});

                return done(null, user);
            })
            .catch((err) => {
                return done(null, false, {message: err.msg});
            });
    })
);

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    getUserById(id)
        .then((user) => {
            done(null, user); // this will be available in req.user
        })
        .catch((err) => {
            done(err, null);
        });
});

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();

    return res.status(401).json({message: 'not authenticated'});
};
// --- --- --- //

/* express setup */
const app = new express();

const errorFormatter = ({location, msg, param, value, nestedErrors}) => {
    // Format express-validate errors as strings
    return `${location}[${param}]: ${msg}`;
};

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

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

/**
 * GET /api/time
 *
 * Used to pass current virtual time clock to the frontend.
 */
app.get('/api/time', (_, res) => {
    res.status(200).json({currentTime: vtc.time(), day: vtc.day()});
});

/**
 * PUT /api/time
 *
 * Used to set current virtual time clock from the frontend.
 *
 * @param {string} time
 */
app.put('/api/time', [check('time').isISO8601()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const time = req.body.time;

    try {
        vtc.set(time);
        res.status(200).json({currentTime: vtc.time(), day: vtc.day()});
    } catch (error) {
        res.status(500).json({error});
    }
});

// GET /api/products
app.get('/api/products', (req, res) => {
    listProducts()
        .then((products) => res.json(products))
        .catch(() => res.status(500).end());
});

// GET /api/clients
app.get('/api/clients', (req, res) => {
    listClients()
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
app.put(
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
            updateClientBalance(id, amount);

            res.status(200).end();
        } catch (error) {
            res.status(500).json({error});
        }
    }
);

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
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty()) {
            return res.status(422).json({error: errors.array().join(', ')});
        }
        insertOrder(req.body)
            .then((id) => res.json(id))
            .catch(() => res.status(500).end());
    }
);

// GET /api/orders
app.get('/api/orders', (req, res) => {
    getOrders()
        .then((orders) => res.json(orders))
        .catch(() => res.status(500).end());
});

// GET /api/orders/:id
// Route used to get the order review
app.get('/api/orders/:id', (req, res) => {
    getOrderById(req.params.id)
        .then((order) => {
            res.json(order);
        })
        .catch(() => {
            res.status(500).end();
        });
});

// POST /api/orders/:id/deliver
app.post('/api/orders/:id/deliver', (req, res) => {
    setOrderDelivered(req.params.id)
        .then((orderId) => {
            res.json(orderId);
        })
        .catch(() => res.status(500).end());
});

// ADD NEW CLIENT
app.post(
    '/api/insert_client',
    check('name').isString(),
    check('surname').isString(),
    check('balance').isInt(),
    check('mail').isEmail(),
    check('typeUser').isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({error: errors.array()});
        }
        const client = req.body;
        insertClient(
            client.name,
            client.surname,
            client.phone,
            client.address,
            client.mail,
            client.balance,
            client.username,
            client.password,
            client.typeUser
        )
            .then((result) => {
                res.end();
            })
            .catch((err) => res.status(500).json(err));
    }
);

app.post('/api/register_user',
    check('name').isString(),
    check('surname').isString(),
    check('mail').isEmail(),
    check('typeUser').isString(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({error: errors.array()});
        }

        const user = req.body;
        registerUser(user)
            .then(() => {
                res.end()
            })
            .catch((err) => {
                res.status(500).json(err)
            });
    })

// --- Login/Logout routes --- //
// Login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate(
        'local',
        {
            failureRedirect: '/api/sessions',
        },
        (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                // display wrong login messages
                return res.status(401).json(info.message);
            }
            // success, perform the login
            req.login(user, (err) => {
                if (err) return next(err);

                // req.user contains the authenticated user, we send all the user info back
                return res.json(req.user);
            });
        }
    )(req, res, next);
});

// --- Logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
});

// --- Check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else res.status(401).json({message: 'Unauthenticated user'});
});

/*** End APIs ***/

export default app;
