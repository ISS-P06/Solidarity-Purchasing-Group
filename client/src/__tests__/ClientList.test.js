import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import axios from 'axios';

import ClientsList, { Client } from '../components/client/ClientsList';

// add mock function for an external function
jest.mock('../components/Message', () => ({
  addMessage: jest.fn(),
}));

jest.mock('axios');

describe('ClientList test', () => {
  test('test visualization of top up wallet', () => {
    render(
      <Client
        client={{
          id: 1,
          name: 'Mario',
          surname: 'Rossi',
          address: 'corso duca',
          balance: 100,
          id: 1,
          mail: 'mario@rossi',
          phone: '3333333333',
        }}
      />
    );
    expect(screen.getByText('Top up wallet')).toBeInTheDocument();
  });

  test('test visualization on add order button', () => {
    render(
      <Client
        client={{
          id: 1,
          name: 'Mario',
          surname: 'Rossi',
          address: 'corso duca',
          balance: 100,
          id: 1,
          mail: 'mario@rossi',
          phone: '3333333333',
        }}
      />
    );
    const addOrderButton = screen.getByText('Add order');
    expect(addOrderButton).toBeInTheDocument();
  });

  test('test click on top up wallet', () => {
    render(
      <Client
        client={{
          id: 1,
          name: 'Mario',
          surname: 'Rossi',
          address: 'corso duca',
          balance: 100,
          id: 1,
          mail: 'mario@rossi',
          phone: '3333333333',
        }}
      />
    );

    //Click on "Top up wallet" button to open the modal
    fireEvent(
      screen.getByText('Top up wallet'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
  });

  test('test click on add order', () => {
    render(
      <Client
        client={{
          id: 1,
          name: 'Mario',
          surname: 'Rossi',
          address: 'corso duca',
          balance: 100,
          id: 1,
          mail: 'mario@rossi',
          phone: '3333333333',
        }}
      />
    );

    //Click on "Add order" button to open the modal
    fireEvent(
      screen.getByText('Add order'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
  });

  test('fetches customers from an API and displays them', async () => {
    const customers = [
      {
        id: 1,
        name: 'Mario',
        surname: 'Rossi',
        address: 'corso duca',
        balance: 100,
        id: 1,
        mail: 'mario@rossi',
        phone: '3333333333',
      },
    ];

    axios.get.mockImplementationOnce(() => Promise.resolve(customers));

    render(<ClientsList />);
  });
});
