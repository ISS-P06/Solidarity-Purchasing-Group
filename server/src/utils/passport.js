import passport from 'passport';
import LocalStrategy from 'passport-local';
import { userDAO } from '../dao';

/**
 * ---
 * This file contains all initializations necessary for the use of passport.
 * Exports:
 * - passportInit: result of passport.initialize(); used in app.js;
 * - passportSession: result of passport.session(); used in app.js;
 * - isLoggedIn: custom middleware function that checks whether the user is logged
 *      in or not. Used in many routes to check for user authentication.
 * ---
 */

// --- Set up Passport --- //
// set up "username and password" strategy
passport.use(
  new LocalStrategy(function (username, password, done) {
    userDAO
      .getUser(username, password)
      .then((user) => {
        if (!user) return done(null, false, { message: 'Incorrect email and/or password.' });

        return done(null, user);
      })
      .catch((err) => {
        return done(null, false, { message: err.msg });
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
  userDAO
    .getUserById(id)
    .then((user) => {
      done(null, user); // this will be available in req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

// custom middleware: check if a given request is coming from an authenticated user
export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ message: 'not authenticated' });
};

export const passportInit = passport.initialize();
export const passportSession = passport.session();
