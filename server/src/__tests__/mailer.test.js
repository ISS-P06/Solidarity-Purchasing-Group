import { mailerUtil } from '../utils';

describe('Test mailer methods', () => {
  test('It should successfully send an e-mail', async () => {
    const result = await mailerUtil.mail_sendBalanceReminder('test@mail.com', -1);

    expect(result).toBe('email sent');
  });

  test('test successful sending warning suspension email ', async () => {
    const result = await mailerUtil.sendWarningSuspension({
      email: 'email@gmail.com' ,
      name : 'abc',
      surname : 'MRx',
      missed_pickups : 3
    });

    expect(result).toBe('email sent');
  });
});
