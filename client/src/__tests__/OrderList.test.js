import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom/extend-expect';
import { Router, Route, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import OrderList from '../components/order/OrderList';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('My component OrderList', () => {

  test('Load all orders', async () => {
    server.use(
      rest.get('/api/orders', (req, res, ctx) => {
        return res(
          ctx.json([
            { orderId: 1, email: 'massimo.poli@p.it', date: '2021-11-16 12:12', status: 'delivered' },
            { orderId: 2, email: 'ciano.gabriele@p.it', date: '2021-11-16 12:11', status: 'delivered' },
          ])
        );
      })
    );

    {/* Test if all elements are rendered */ }
    const history = createMemoryHistory();
    history.push = jest.fn();

    render(
      <MemoryRouter history={history}>
        <OrderList userRole='shop_employee' userId='1' />
      </MemoryRouter>
    );

    expect(screen.getByText('No orders found')).toBeInTheDocument();
    await waitFor(() => screen.getByText('Date: 2021-11-16 12:12'));
    expect(screen.getByText('Email: massimo.poli@p.it')).toBeInTheDocument();
    expect(screen.getByText('Date: 2021-11-16 12:12')).toBeInTheDocument();
    expect(screen.getByText('Email: ciano.gabriele@p.it')).toBeInTheDocument();
    expect(screen.getByText('Date: 2021-11-16 12:11')).toBeInTheDocument();
  });

  test('Load all client orders', async () => {
    server.use(
      rest.get('/api/clients/4/orders', (req, res, ctx) => {
        return res(
          ctx.json([
            { orderId: 1, email: 'massimo.poli@p.it', date: '2021-11-16 12:12', status: 'delivered' },
            { orderId: 2, email: 'ciano.gabriele@p.it', date: '2021-11-16 12:11', status: 'delivered' },
          ])
        );
      })
    );

    {/* Test if all elements are rendered */ }
    const history = createMemoryHistory();
    history.push = jest.fn();

    render(
      <MemoryRouter history={history}>
        <OrderList userRole='client' userId='4' />
      </MemoryRouter>
    );

    expect(screen.getByText('No orders found')).toBeInTheDocument();
    await waitFor(() => screen.getByText('Date: 2021-11-16 12:12'));
    expect(screen.getByText('Email: massimo.poli@p.it')).toBeInTheDocument();
    expect(screen.getByText('Date: 2021-11-16 12:12')).toBeInTheDocument();
    expect(screen.getByText('Email: ciano.gabriele@p.it')).toBeInTheDocument();
    expect(screen.getByText('Date: 2021-11-16 12:11')).toBeInTheDocument();
  });

});
