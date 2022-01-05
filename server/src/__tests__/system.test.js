import { systemDAO } from '../dao';
import { SYS } from '../utils';
import { restoreBackup } from '../db';

const sys = new SYS();

/**
 * During test the database can be modified, so we need to
 * restore its state from a backup
 */
afterAll(() => {
  restoreBackup();
});

/** TEST SUITES */
describe('Test SYS class: trigger for insufficient balance notification', () => {
  beforeAll(async () => {
    await systemDAO.test_addDummyOrders();
  });

  test('Everything should work', () => {
    // Mon. 9am
    let day = new Date('December 06, 2021 09:00:00');

    // checkTimedEvents is called with test = true
    sys.checkTimedEvents(day, true);

    let mailingList = [
      {
        email: 'test@test.com',
        id: -1,
      },
    ];

    // Called with test = true
    sys.event_sendBalanceReminders(mailingList, true);
  });
});

describe('Test SYS class: trigger for basket reset', () => {
  test('Everything should work', () => {
    // Monday - outside interval; checks one condition
    let day1 = new Date('December 06, 2021 23:15:30');
    // Sat. 8am - barely outside interval; checks one condition
    let day2 = new Date('December 04, 2021 08:00:00');
    // Sun. 23:30am - barely outside interval; checks one condition
    let day3 = new Date('December 05, 2021 23:30:00');
    // Sun. 16am - inside interval
    let day4 = new Date('December 05, 2021 16:00:00');

    sys.checkTimedEvents(day1);
    sys.checkTimedEvents(day2);
    sys.checkTimedEvents(day3);
    sys.checkTimedEvents(day4);
  });
});

describe('Test SYS class: trigger to set order to unretrieved status', () => {
  beforeAll(async () => {
    await systemDAO.test_addConfirmedDummyOrders();
  });

  test('Everything should work', () => {
    // Friday, 23:00 
    // The dummy order changes status from 'confirmed' to 'unretrieved'
    let day = new Date('January 07, 2022 23:00:00');

    sys.checkTimedEvents(day);
  });
});