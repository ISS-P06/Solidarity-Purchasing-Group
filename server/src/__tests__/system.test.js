import request from 'supertest';
import app from '../app';

import {test_addDummyOrders} from '../system-dao';

import { copyFileSync, unlinkSync } from 'fs';

/** During test the database can be modified, so we need to backup its state */

const dbPath = 'database.db';
const backupPath = 'database.db.backup.system';

// Save database current state
beforeAll(() => {
  copyFileSync(dbPath, backupPath);
});

// Reset database current state
afterAll(() => {
  copyFileSync(backupPath, dbPath);
  unlinkSync(backupPath);
});

import SYS from '../system';

const sys = new SYS();

/** TEST SUITES */
describe("Test SYS class: trigger for insufficient balance notification", () => {
    beforeAll(async () => {
        await test_addDummyOrders();
    });

    test("Everything should work", () => {
        // Mon. 9am
        let day = new Date("December 06, 2021 09:00:00");
        
        sys.checkTimedEvents(day);

        sys.event_updateOrders();

        let mailingList = [
            {
                email: "test@test.com",
                id: -1
            }
        ];

        sys.event_sendBalanceReminders(mailingList);
    });
});

describe("Test SYS class: trigger for basket reset", () => {
    test("Everything should work", () => {
        // Monday - outside interval; checks one condition
        let day1 = new Date('December 06, 2021 23:15:30');
        // Sat. 8am - barely outside interval; checks one condition
        let day2 = new Date("December 04, 2021 08:00:00");
        // Sun. 23:30am - barely outside interval; checks one condition
        let day3 = new Date("December 05, 2021 23:30:00");
        // Sun. 16am - inside interval
        let day4 = new Date("December 05, 2021 16:00:00");
        
        sys.checkTimedEvents(day1);
        sys.checkTimedEvents(day2);
        sys.checkTimedEvents(day3);
        sys.checkTimedEvents(day4);
    });
});
