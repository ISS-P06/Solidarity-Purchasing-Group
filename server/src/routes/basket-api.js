'use strict';

import express from 'express';
import { check, validationResult } from 'express-validator';
import { passportUtil } from '../utils';
var router = express.Router();

const isLoggedIn = passportUtil.isLoggedIn;

/**
 * ---
 * This file contains all BE routes used to get and post data about 
 * the users' own baskets.
 * ---
 */

module.exports = router;
