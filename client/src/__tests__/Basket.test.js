import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Basket from '../components/order/Basket';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import '@testing-library/jest-dom/extend-expect';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('My component Basket', () => {

    test('Is Rendered without product', async () => {

        server.use(
            rest.get('/api/client/1/basket', (req, res, ctx) => {
                return res(ctx.json([])
            );
        }))

        render(<Basket userId={1} />);
        await waitFor(() => screen.getByText(/There are no products in the basket/));
        expect(screen.getByText(/There are no products in the basket/)).toBeInTheDocument();

    });

    test('Is Rendered', async () => {

        server.use(
            rest.get('/api/client/1/basket', (req, res, ctx) => {
                return res(ctx.json([{
                    category: "fruits-and-vegetables",
                    name: "Onion",
                    price: 0.8,
                    quantity: 2.6
                },
                {
                    category: "fruits-and-vegetables",
                    name: "Apple",
                    price: 1.5,
                    quantity: 1.5
                }])
            );
        }))

        render(<Basket userId={1} />);
        await waitFor(() => screen.getByText(/Onion/));
        expect(screen.getByText(/Onion/)).toBeInTheDocument();
        expect(screen.getByText(/Apple/)).toBeInTheDocument();
        expect(screen.getByText(/Buy Now/)).toBeInTheDocument();
    });

    test('Is able to buy itmes', async () => {

        let db = [{
            category: "fruits-and-vegetables",
            name: "Onion",
            price: 0.8,
            quantity: 2.6
        },
        {
            category: "fruits-and-vegetables",
            name: "Apple",
            price: 1.5,
            quantity: 1.5
        }];

        server.use(
            rest.get('/api/client/1/basket', (req, res, ctx) => {
                return res(ctx.json(db)
            );
        }));  
        
        server.use(
            rest.put('/api/client/1/basket/buy', (req, res, ctx) => {
                db = [];
                return res(ctx.json(db)
            );
        }));
        
        render(<Basket userId={1} />);
        await waitFor(() => screen.getByText(/Onion/));
        expect(screen.getByText(/Onion/)).toBeInTheDocument();
        expect(screen.getByText(/Apple/)).toBeInTheDocument();
        expect(screen.getByText(/Buy Now/)).toBeInTheDocument();

        await userEvent.click(screen.getByText(/Buy Now/));

        await waitFor(() => screen.getByText(/Well done, your order has been inserted!/));

        expect(screen.getByText(/Well done, your order has been inserted!/)).toHaveTextContent(/Well done, your order has been inserted!/);

        expect(db).toStrictEqual([]);
        //await waitFor(() => screen.getByText(/There are no products in the basket/));
        //expect(screen.getByText(/There are no products in the basket/)).toBeInTheDocument();

    });

    test('Is able to handle error in response', async () => {

        server.use(
            rest.get('/api/client/3/basket', (req, res, ctx) => {
                return res(ctx.status(500), ctx.json({ data: `Error` })
            );
        }))

        render(<Basket userId={3} />);
        await waitFor(() => screen.getByText(/There are no products in the basket/));
        expect(screen.getByText(/There are no products in the basket/)).toBeInTheDocument();

    });

});