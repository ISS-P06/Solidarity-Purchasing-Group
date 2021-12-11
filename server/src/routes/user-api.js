'use strict';

import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { userDAO } from '../dao';
import passport from 'passport';

export const router = Router();

/**
 * ---
 * This file contains all BE routes used to get and post data about the
 * site's users. It also contains routes used to log the user in and out, and
 * to retrieve the logged-in user's data.
 * ---
 */

// --- Login/Logout APIs --- //

/**
 * POST /api/sessions
 * Used to log a user in.
 * Returns user info when successful
 */
router.post('/api/sessions', function (req, res, next) {
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

/**
 * DELETE /api/sessions/current
 * Used to log a user out.
 */
router.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

/**
 * GET /api/sessions/current
 * Used to get information about the user that's currently logged in.
 * Returns user info when successful.
 */
router.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ message: 'Unauthenticated user' });
});

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
      return res.status(422).json({ error: errors.array() });
    }

    const user = req.body;
    userDAO
      .registerUser(user)
      .then(() => {
        res.end();
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
);
