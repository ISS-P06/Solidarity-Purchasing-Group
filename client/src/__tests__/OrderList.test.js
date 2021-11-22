import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom/extend-expect';
import { Router, Route, MemoryRouter } from 'react-router-dom';
import {createMemoryHistory} from 'history';
import OrderList from '../components/order/OrderList';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('My component OrderList', () => {
  test('Is Rendered', async () => {
    server.use(
      rest.get('/api/orders', (req, res, ctx) => {
        return res(
          ctx.json([
            { orderId: 1, email: 'massimo.poli@p.it' },
            { orderId: 2, email: 'ciano.gabriele@p.it' },
          ])
        );
      })
    );

    {
      /* Test if all elements are rendered */
    }
    const history = createMemoryHistory();
    history.push = jest.fn();

    const { getByText } = render(<MemoryRouter history={history}><OrderList /></MemoryRouter>);

    expect(screen.getByRole('heading')).toHaveTextContent('Orders');
    await waitFor(() => getByText(/1/));
    expect(getByText(/1/)).toBeInTheDocument();
    expect(getByText(/2/)).toBeInTheDocument();
    expect(getByText(/massimo.poli@p.it/)).toBeInTheDocument();
  });
});
