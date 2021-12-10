import request from 'supertest';
import app from '../app';

import { mailerUtil } from '../utils';

describe("Test mailer methods", () => {
    test("It should successfully send an e-mail", async () => {
        const result = await mailerUtil.mail_sendBalanceReminder("test@mail.com", -1);

        expect(result).toBe("email sent");
    });
});
