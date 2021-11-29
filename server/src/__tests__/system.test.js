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