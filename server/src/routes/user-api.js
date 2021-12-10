'use strict';

import express from 'express';
import { check, validationResult } from 'express-validator';
import { userDAO } from '../dao';
var router = express.Router();

/**
 * POST /api/register_user
 * Registration of a user
 */
router.post(
    '/api/register_user',
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
        userDAO.registerUser(user)
            .then(() => {
                res.end();
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    }
);

module.exports = router;
