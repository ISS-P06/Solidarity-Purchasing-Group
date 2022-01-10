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

export const passportInit = passport.initialize();
export const passportSession = passport.session();

// custom middleware: check if a given request is coming from an authenticated user
export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ message: 'not authenticated' });
};

// --- --- --- //
/* 
  The following is a list of middlewares that both check
  whether a user is logged in AND has a specific role.
  Their use is the same as the "isLoggedIn" middleware.
*/
// Employee
export const isLoggedIn_Employee = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "shop_employee")
    return next();

  return res.status(401).json({ message: 'not authenticated'});
};

// Client
export const isLoggedIn_Client = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "client")
    return next();

  return res.status(401).json({ message: 'not authenticated'});
};

// Farmer
export const isLoggedIn_Farmer = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "farmer")
    return next();

  return res.status(401).json({ message: 'not authenticated'});
};

// Manager
export const isLoggedIn_Manager = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "manager")
    return next();

  return res.status(401).json({ message: 'not authenticated'});
};

// Shop employee or client
export const isLoggedIn_ShopEmployeeOrClient = (req, res, next) => {
  if (req.isAuthenticated() && (req.user.role === "client" || req.user.role === "shop_employee" ))
    return next();
  return res.status(401).json({ message: 'not authenticated'});
};

// Temporary suspension
export const isNotSuspended = (req, res, next) => {
  userDAO.checkUserSuspensionsById(req.user.id).then((isSuspended) => {
      if(isSuspended)
        return res.status(403).json({ message: 'forbidden: user suspended'});
      else
        return next();
  }).catch(e => console.log(e));
};