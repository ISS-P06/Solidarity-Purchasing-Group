import React from 'react'
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from "history";

import OrderReview from '../components/OrderReview';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import '@testing-library/jest-dom/extend-expect'

const server = setupServer();

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

export function renderWithRouterMatch(
    ui,
    {
      path = "/",
      route = "/",
      history = createMemoryHistory({ initialEntries: [route] })
    } = {}
  ) {
    return {
      ...render(
        <Router history={history}>
          <Route path={path} component={ui} />
        </Router>
      )
    };
  }

describe('My component OrderReview', async => {
    test('Is Rendered', async () => {

        server.use(
            rest.get('/api/orders/1', (req, res, ctx) => {
              return res(
                ctx.json({orderId: 1,
                    email: 'massimo.rossi@mail.com',
                    products: [
                        {
                            name: 'onion',
                            quantity: 1.3,
                            price: 1.6
                        }                
                    ],
                    status: 'pending'})
              )
            }),
          )
            
        {/* Test if all elements are rendered */}

        const { getByText } = renderWithRouterMatch(OrderReview, {
            route: "/employee/orders/1",
            path: "/employee/orders/:id"
          });

          expect(getByText(/Order Review/)).toBeInTheDocument();
          await waitFor(() => getByText(/#1/));
          expect(getByText(/#1/)).toBeInTheDocument();
          screen.debug();
          expect(getByText(/massimo.rossi@mail.com/)).toBeInTheDocument();
          expect(getByText(/onion/)).toBeInTheDocument();
    });

    test('Delivers an order', async () => {
        let isDelivered = false;

        server.use(
            rest.get('/api/orders/1', (req, res, ctx) => {
                if(!isDelivered)
                return res(
                    ctx.json({orderId: 1,
                        email: 'massimo.rossi@mail.com',
                        products: [
                            {
                                name: 'onion',
                                quantity: 1.3,
                                price: 1.6
                            }                
                        ],
                        status: 'pending'})
                  );
                  else{
                    return res(
                        ctx.json({orderId: 1,
                            email: 'massimo.rossi@mail.com',
                            products: [
                                {
                                    name: 'onion',
                                    quantity: 1.3,
                                    price: 1.6
                                }                
                            ],
                            status: 'delivered'})
                      )
                  }
            }),
          )

          server.use(
            rest.post('/api/orders/1/deliver', (req, res, ctx) => {
                isDelivered = true;
                return res(
                ctx.json({orderId: 1})
              )
            }),
          )
            
        {/* Test if an order can be delivered */}

        const { getByText } = renderWithRouterMatch(OrderReview, {
            route: "/employee/orders/1",
            path: "/employee/orders/:id"
          });

          await waitFor(() => getByText(/#1/));
          expect(getByText(/#1/)).toBeInTheDocument();
          
          userEvent.click(getByText(/Deliver/));

          await waitFor(() => getByText(/delivered/));
          expect(getByText(/delivered/)).toBeInTheDocument();

    });
});
