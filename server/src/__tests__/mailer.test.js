import request from 'supertest';
import app from '../app';

import { mail_sendBalanceReminder } from '../mailer';

describe("Test mailer methods", () => {
    test("It should successfully send an e-mail", async () => {
        const result = await mail_sendBalanceReminder("test@mail.com", 42);

        expect(result).toBe("email sent");
    });
});
