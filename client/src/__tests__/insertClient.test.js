import React from 'react';
import {render, screen, fireEvent, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { InsertClient } from '../components';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

// add mock function for an external function
jest.mock('../components/Message', () => ({
  addMessage: jest.fn(),
}));

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

    const clientName = screen.getByLabelText('Name');
    expect(clientName).toBeInTheDocument();

    const clientSurname = screen.getByLabelText('Surname');
    expect(clientSurname).toBeInTheDocument();

    const clientMail = screen.getByLabelText('Email address');
    expect(clientMail).toBeInTheDocument();

    const clientPhone = screen.getByLabelText('Phone number');
    expect(clientPhone).toBeInTheDocument();

    const clientAddress = screen.getByLabelText(/Address/);
    expect(clientAddress).toBeInTheDocument();

    const clientBalance = screen.getByLabelText(/Balance/);
    expect(clientBalance).toBeInTheDocument();

    const clientUsername = screen.getByLabelText(/Username/);
    expect(clientUsername).toBeInTheDocument();

    const clientPassword = screen.getByLabelText(/Password/);
    expect(clientPassword).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    const submitButton = screen.getByText(/Submit/);
    expect(submitButton).toBeInTheDocument();
  });

  test('test submission', async () => {
    const clientData = {
      name: 'Dario',
      surname: 'Giordano',
      phone: '0123456789',
      address: 'via braccini, Torino',
      mail: 'dario@giordano',
      balance: '10',
      username: 'Dario',
      password: 'xxxxxxxxxx',
    };

    let db = [];
    server.use(
      rest.post('/api/insert_client', (req, res, ctx) => {
        const client = req.body;
        db.push(client)
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


    const clientName = screen.getByLabelText('Name');
    userEvent.type(clientName, clientData.name);
    expect(clientName.value).toBe(clientData.name);


    const clientSurname = screen.getByLabelText('Surname');
    userEvent.type(clientSurname, clientData.surname);
    expect(clientSurname.value).toBe(clientData.surname);


    const clientMail = screen.getByLabelText('Email address');
    userEvent.type(clientMail, clientData.mail);
    expect(clientMail.value).toBe(clientData.mail);


    const clientPhone = screen.getByLabelText('Phone number');
    userEvent.type(clientPhone, clientData.phone);
    expect(clientPhone.value).toBe(clientData.phone);


    const address = screen.getByLabelText(/Address/);
    userEvent.type(address, clientData.address);
    expect(address.value).toBe(clientData.address);


    const clientBalance = screen.getByLabelText(/Balance/);
    userEvent.type(clientBalance, clientData.balance);
    expect(clientBalance.value).toBe(clientData.balance);

    const clientUsername = screen.getByLabelText(/Username/);
    userEvent.type(clientUsername, clientData.username);
    expect(clientUsername.value).toBe(clientData.username);


    const clientPassword = screen.getByLabelText(/Password/);
    userEvent.type(clientPassword, clientData.password);
    expect(clientPassword.value).toBe(clientData.password);

    const submitButton = screen.getByText(/Submit/);
    act( ()=>{
       userEvent.click(submitButton);
    })

      await waitFor(() => {
        expect(db[0].name).toBe(clientData.name);
        expect(db[0].surname).toBe(clientData.surname);
        expect(db[0].mail).toBe(clientData.mail);
        expect(db[0].address).toBe(clientData.address);
        expect(db[0].balance.toString()).toBe(clientData.balance);
        expect(db[0].username).toBe(clientData.username);
        expect(db[0].password).toBe(clientData.password);
      })

  });
});
