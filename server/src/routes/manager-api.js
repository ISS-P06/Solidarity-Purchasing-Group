'use strict';

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { managerDAO } from '../dao';
import { isLoggedIn_Manager } from '../utils';
import VTC from '../utils/vtc';

const vtc = new VTC();

export const router = Router();

/**
 * GET /api/manager/stats
 * Get stats for the manager homepage
 * @returns see managerDAO.computeHomepageStats
 *      for info on the returned object
 */

router.get('/api/manager/stats', isLoggedIn_Manager,
    (req, res) => {
        managerDAO.computeHomepageStats(vtc.time())
            .then((result) => 
                res.status(200).json(result).end())
            .catch((err) => 
                res.status(500).json({ err }));
    });

/**
 * POST /api/manager/report/weekly
 * Get a weekly report by supplying a specific date
 * @returns see managerDAO.generateWeeklyReport
 *      for info on the returned object
 */
router.post('/api/manager/report/weekly', isLoggedIn_Manager,
    body("date").isISO8601(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        }

        managerDAO.generateWeeklyReport(new Date(req.body.date))
            .then((result) => 
                res.status(200).json(result).end())
            .catch((err) => 
                res.status(500).json({ err }));
    });

/**
 * POST /api/manager/report/monthly
 * Get a monthly report by supplying a specific date
 * @returns see managerDAO.generateMonthlyReport
 *      for info on the returned object
 */
router.post('/api/manager/report/monthly', isLoggedIn_Manager,
    body("date").isISO8601(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        }

        managerDAO.generateMonthlyReport(new Date(req.body.date))
            .then((result) => 
                res.json(result))
            .catch((err) => 
                res.status(500).json({ err }));
    });
