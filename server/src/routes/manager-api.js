'use strict';

import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { managerDAO } from '../dao';
import { isLoggedIn_Manager } from '../utils';

export const router = Router();

/**
 * GET /api/manager/report/weekly
 * Get a weekly report by supplying a specific date
 * @returns see managerDAO.generateWeeklyReport
 *      for info on the returned object
 */
router.get("/api/manager/report/weekly", isLoggedIn_Manager, 
    check("date").isDate(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        }

        managerDAO.generateWeeklyReport(req.body.date)
            .then((result) => 
                res.status(200).json(result).end())
            .catch((err) => 
                res.status(500).json({ err }));
    });

/**
 * GET /api/manager/report/monthly
 * Get a monthly report by supplying a specific date
 * @returns see managerDAO.generateMonthlyReport
 *      for info on the returned object
 */
 router.get("/api/manager/report/monthly", isLoggedIn_Manager, 
    check("date").isDate(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        }

        managerDAO.generateMonthlyReport(req.body.date)
            .then((result) => 
                res.status(200).json(result).end())
            .catch((err) => 
                res.status(500).json({ err }));
    });


