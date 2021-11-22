import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { InsertClient } from '../components';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('testing InsertClient component', () => {
  // mock client

  test('testing insertion of new client', () => {
    const history = createMemoryHistory();

    // mock push function
    history.push = jest.fn();

    render(
      <Router history={history}>
        <InsertClient />
      </Router>
    );

    const clientName = screen.getByLabelText('Client name');
    expect(clientName).toBeInTheDocument();

    const clientSurname = screen.getByLabelText('Client surname');
    expect(clientSurname).toBeInTheDocument();

    const clientMail = screen.getByLabelText('Email address');
    expect(clientMail).toBeInTheDocument();

    const clientPhone = screen.getByLabelText('Phone number');
    expect(clientPhone).toBeInTheDocument();

    const clientAddress = screen.getByLabelText('Address');
    expect(clientAddress).toBeInTheDocument();

    const clientBalance = screen.getByLabelText('Balance');
    expect(clientBalance).toBeInTheDocument();

    const clientUsername = screen.getByLabelText('Username');
    expect(clientUsername).toBeInTheDocument();

    const clientPassword = screen.getByLabelText('Password');
    expect(clientPassword).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeInTheDocument();
  });

  test('test submission', async () => {
    const clientData = {
      name: 'Dario',
      surname: 'Giordano',
      phone: '0123456789',
      address: 'via braccini, Torino',
      mail: 'dario@giordano',
      balance: 10,
      username: 'Dario',
      password: 'xxxxxxxxxx',
    };

    server.use(
      rest.post('/api/insert_client', (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    const history = createMemoryHistory();

    // mock push function
    history.push = jest.fn();

    render(
      <Router history={history}>
        <InsertClient />
      </Router>
    );

    const clientName = screen.getByLabelText('Client name');
    userEvent.type(clientName, clientData.name);
    expect(clientName.value).toBe(clientData.name);

    const clientSurname = screen.getByLabelText('Client surname');
    userEvent.type(clientSurname, clientData.surname);
    expect(clientSurname.value).toBe(clientData.surname);

    // todo fix tests
    //
    // const clientMail = screen.getByLabelText('Email address');
    // userEvent.type(clientMail, {
    //   target: { value: clientData.mail },
    // });

    // const clientPhone = screen.getByLabelText('Phone number');
    // userEvent.type(clientPhone, {
    //   target: { value: clientData.phone },
    // });

    // const address = screen.getByLabelText('Address');
    // userEvent.type(address, {
    //   target: {
    //     value: clientData.address,
    //   },
    // });

    // const clientBalance = screen.getByLabelText('Balance');
    // userEvent.type(clientBalance, {
    //   target: { value: clientData.balance },
    // });

    // const clientUsername = screen.getByLabelText('Username');
    // userEvent.type(clientUsername, {
    //   target: { value: clientData.username },
    // });

    // const clientPassword = screen.getByLabelText('Password');
    // userEvent.type(clientPassword, {
    //   target: { value: clientData.password },
    // });

    const submitButton = screen.getByText('Submit');
    userEvent.click(submitButton);
  });
});
