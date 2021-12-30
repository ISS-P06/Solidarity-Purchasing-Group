import request from 'supertest';
import session from 'supertest-session';
import dayjs from 'dayjs';

import app from '../app';
import { restoreBackup } from '../db';
import { managerDAO } from '../dao';

/**
 * During test the database can be modified, so we need to
 * restore its state from a backup
 */
afterAll(() => {
  restoreBackup();
});

// Auth session for logged user tests
const testSession = session(app);
let authSession_manager = null;

// Login as a manager
beforeEach((done) => {
  testSession
    .post('/api/sessions')
    .send({ username: 'manager', password: 'mudamuda' })
    .end((err) => {
      if (err) return done(err);      
      authSession_manager = testSession;
      return done();
    });
});

// --- Test suites --- //
describe('Test the manager report APIs', () => {
  const date = dayjs(new Date("January, 3 2999 00:00:00")).format("YYYY-MM-DD HH:mm");

  // --- Test weekly report API
  test('It should respond 200 to the POST method', function (done) {
		authSession_manager.post('/api/manager/report/weekly').send({ date: date }).expect(200).end(done);
	});

  test('It should respond 422 to the POST method', function (done) {
    // no body supplied -> error
		authSession_manager.post('/api/manager/report/weekly').send({}).expect(422).end(done);
	});

  // --- Test monthly report API
  test('It should respond 200 to the POST method', function (done) {
		authSession_manager.post('/api/manager/report/monthly').send({ date: date }).expect(200).end(done);
	});

  test('It should respond 422 to the POST method', function (done) {
    // no body supplied -> error
		authSession_manager.post('/api/manager/report/monthly').send({}).expect(422).end(done);
	});
});

describe("Test manager reports", () => {
  beforeAll(async () => {
    await managerDAO.test_addDummyOrders_report();
  });

  const date1 = dayjs(new Date("January, 3 2999 00:00:00")).format("YYYY-MM-DD HH:mm");
  const date2 = dayjs(new Date("February, 2 2999 00:00:00")).format("YYYY-MM-DD HH:mm");
  const date3 = dayjs(new Date("November, 13 2999 00:00:00")).format("YYYY-MM-DD HH:mm");

  // --- Test suites --- //
  test("Test monthly report results", async () => {
    const stats_jan = await managerDAO.generateMonthlyReport(new Date(date1));

    expect(stats_jan.totalOrders).toBe(2);
    expect(stats_jan.deliveredOrders).toBe(1);
    expect(stats_jan.perc_undeliveredOrd).toBe(0.5);

    const stats_feb = await managerDAO.generateMonthlyReport(new Date(date2));
    
    expect(stats_feb.totalOrders).toBe(0);

    const stats_nov = await managerDAO.generateMonthlyReport(new Date(date3));

    expect(stats_nov.totalOrders).toBe(0);
  });
});
