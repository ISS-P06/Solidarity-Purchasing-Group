import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ProductCards from '../components/ProductCards';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('test ProductCards component correct rendering', async () => {
  // add a runtime request handler
  server.use(
    rest.get('/api/products', (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 1,
            name: 'Baguette',
            description: 'Delicious',
            category: 'bread',
            quantity: 1,
            price: 1,
            unit: 'Kg',
          },
        ])
      );
    })
  );
  // test code
  window.scrollTo = jest.fn();
  render(<ProductCards />);
  await waitFor(() => screen.getByText('Baguette'));
  expect(screen.getByText('Baguette')).toBeInTheDocument();
});

test("test ProductCards component wrong rendering'", async () => {
  // add a runtime request handler
  server.use(
    rest.get('/api/products', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ data: `Error` }));
    })
  );
  // test code
  window.scrollTo = jest.fn();
  render(<ProductCards />);
  await waitFor(() => screen.getByText('Error in getting all the products'));
  expect(screen.getByText('Error in getting all the products')).toBeInTheDocument();
});

test("test ProductCards component adds a product to the basket'", async () => {

  let db = [];
  server.use(
    rest.get('/api/products', (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 1,
            name: 'Baguette',
            description: 'Delicious',
            category: 'bread',
            quantity: 1,
            price: 1,
            unit: 'Kg',
          },
        ])
      );
    })
  );
  // add a runtime request handler
  server.use(
    rest.post('/api/client/1/basket/add', (req, res, ctx) => {
      const {productId, reservedQuantity} = req.body;
      console.log(ok);
      db = [{productId: productId,
            reservedQuantity: reservedQuantity}];
      return res(
        ctx.status(200),
        ctx.json({}));
    })
  );

  // test code
  window.scrollTo = jest.fn();
  render(<ProductCards userRole="client" userId="1"/>);
  
  await waitFor(() => screen.getByText('Baguette'));
  expect(screen.getByText('Baguette')).toBeInTheDocument();

  const addButton = screen.getByText('+');
  await userEvent.click(addButton);

  const textArea = screen.getByPlaceholderText(/Insert Quantity/);
  userEvent.type(textArea , '0.5');

  await userEvent.click(screen.getByText(/Add product to Basket/));

  //expect(db).toHaveLength(1);

});


test("test ProductCards component throws an error if added quantity less than 0.1kg or lt", async () => {

  server.use(
    rest.get('/api/products', (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 1,
            name: 'Baguette',
            description: 'Delicious',
            category: 'bread',
            quantity: 1,
            price: 1,
            unit: 'Kg',
          },
        ])
      );
    })
  );
  
  // test code
  window.scrollTo = jest.fn();
  render(<ProductCards userRole="client" userId="1"/>);
  
  await waitFor(() => screen.getByText('Baguette'));
  expect(screen.getByText('Baguette')).toBeInTheDocument();

  const addButton = screen.getByText('+');
  await userEvent.click(addButton);

  const textArea = screen.getByPlaceholderText(/Insert Quantity/);
  userEvent.type(textArea , '0.05');

  await userEvent.click(screen.getByText(/Add product to Basket/));
  
  await waitFor(() => screen.getByText(/You cannot add less than 0.1 Kg/));
  expect(screen.getByText(/You cannot add less than 0.1 Kg/)).toBeInTheDocument();

});

test("test ProductCards component throws an error if added quantity more than the available", async () => {

  server.use(
    rest.get('/api/products', (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 1,
            name: 'Baguette',
            description: 'Delicious',
            category: 'bread',
            quantity: 1,
            price: 1,
            unit: 'Kg',
          },
        ])
      );
    })
  );
  
  // test code
  window.scrollTo = jest.fn();
  render(<ProductCards userRole="client" userId="1"/>);
  
  await waitFor(() => screen.getByText('Baguette'));
  expect(screen.getByText('Baguette')).toBeInTheDocument();

  const addButton = screen.getByText('+');
  await userEvent.click(addButton);

  const textArea = screen.getByPlaceholderText(/Insert Quantity/);
  userEvent.type(textArea , '20');

  await userEvent.click(screen.getByText(/Add product to Basket/));
  
  await waitFor(() => screen.getByText(/You cannot add more than the available quantity/));
  expect(screen.getByText(/You cannot add more than the available quantity/)).toBeInTheDocument();

});

test("test ProductCards component is able to search a product", async () => {

  server.use(
    rest.get('/api/products', (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 1,
            name: 'Baguette',
            description: 'Delicious',
            category: 'bread',
            quantity: 1,
            price: 1,
            unit: 'Kg',
          },
          {
            id: 2,
            name: 'Onion',
            description: 'Delicious',
            category: 'fruits-and-vegetables',
            quantity: 1,
            price: 1,
            unit: 'Kg',
          },
        ])
      );
    })
  );
  
  // test code
  window.scrollTo = jest.fn();
  render(<ProductCards userRole="client" userId="1"/>);
  
  await waitFor(() => screen.getByText('Baguette'));
  expect(screen.getByText('Baguette')).toBeInTheDocument();

  await waitFor(() => screen.getByText('Onion'));
  expect(screen.getByText('Onion')).toBeInTheDocument();


  const searchBar =  screen.getByPlaceholderText('Search Product');
  userEvent.type(searchBar, 'B');
  
  expect(screen.getByText('Baguette')).toBeInTheDocument();

});

test("test ProductCards component throws an error if the searched product is not in the list", async () => {

  server.use(
    rest.get('/api/products', (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 1,
            name: 'Baguette',
            description: 'Delicious',
            category: 'bread',
            quantity: 1,
            price: 1,
            unit: 'Kg',
          },
          {
            id: 2,
            name: 'Onion',
            description: 'Delicious',
            category: 'fruits-and-vegetables',
            quantity: 1,
            price: 1,
            unit: 'Kg',
          },
        ])
      );
    })
  );
  
  // test code
  window.scrollTo = jest.fn();
  render(<ProductCards userRole="client" userId="1"/>);
  
  await waitFor(() => screen.getByText('Baguette'));
  expect(screen.getByText('Baguette')).toBeInTheDocument();

  await waitFor(() => screen.getByText('Onion'));
  expect(screen.getByText('Onion')).toBeInTheDocument();


  const searchBar =  screen.getByPlaceholderText('Search Product');
  userEvent.type(searchBar, 'Hamburger');
  
  expect(screen.getByText('Sorry there are no products with name Hamburger')).toBeInTheDocument();

});


