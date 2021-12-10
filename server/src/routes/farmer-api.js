'use strict';

import express from 'express';
import { check, validationResult } from 'express-validator';
import { passportUtil } from '../utils';
var router = express.Router();

const isLoggedIn = passportUtil.isLoggedIn;

/**
 * ---
 * This file contains all BE routes used to get and post data about
 * the site's farmers (which are a subset of the site's users, with
 * specific priviledges and permissions).
 * ---
 */

module.exports = router;
