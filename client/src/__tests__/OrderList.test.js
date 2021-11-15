import React from 'react'
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act } from 'react-dom/test-utils'

import OrderList from '../components/OrderList';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import '@testing-library/jest-dom/extend-expect'

const server = setupServer();

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('My component OrderList', async => {
    test('Is Rendered', async () => {

        server.use(
            rest.get('/api/orders', (req, res, ctx) => {
              return res(
                ctx.json([
                    { orderId: 1, email: 'massimo.poli@p.it' },
                    { orderId: 2, email: 'ciano.gabriele@p.it' } ])
              )
            }),
          )
            
        {/* Test if all elements are rendered */}

        const {getByText} =  render(<OrderList />);
        
        expect(screen.getByRole('heading')).toHaveTextContent('Orders');
        //await waitFor(() => getByText(/#1/)); 
        //expect(getByText(/#1/)).toBeInTheDocument();

    });
});
