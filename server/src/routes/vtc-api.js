'use strict';

import { Router } from 'express';
import { check, validationResult } from 'express-validator';

// --- Import and initialize utility classes: --- //
import VTC from '../utils/vtc';
import SYS from '../utils/system';

/** Virtual Time Clock */
const vtc = new VTC();
/* System class */
const sys = new SYS();

const router = Router();

/**
 * ---
 * This file contains all BE routes used to manipulate and retrieve the
 * system's virtual time.
 * ---
 */

/**
 * GET /api/time
 *
 * Used to pass current virtual time clock to the frontend.
 */
router.get('/api/time', (_, res) => {
  res.status(200).json({ currentTime: vtc.time(), day: vtc.day() });
});

/**
 * PUT /api/time
 *
 * Used to set current virtual time clock from the frontend.
 *
 * @param {string} time
 */
router.put('/api/time', [check('time').isISO8601()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const time = req.body.time;

  try {
    const newTime = vtc.set(time);
    sys.checkTimedEvents(newTime);
    res.status(200).json({ currentTime: vtc.time(), day: vtc.day() });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
