import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import ProductCards from "../components/ProductCards";
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer();

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test("test ProductCards component correct rendering", async () => {
  // add a runtime request handler
  server.use(
    rest.get('/api/products', (req, res, ctx) => {
      return res(
        ctx.json([{ id: 1, name: "Baguette", description: "Delicious", category: "bread", quantity: 1, price: 1, unit: "Kg" }])
      )
    }),
  )
  // test code
  window.scrollTo = jest.fn();
  render(<ProductCards/>);
  await waitFor(() => screen.getByText('Baguette'))
  expect(screen.getByText('Baguette')).toBeInTheDocument();
});


test("test ProductCards component wrong rendering'", async () => {
  // add a runtime request handler
  server.use(
    rest.get('/api/products', (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ data: `Error` }))
    }),
  )
  // test code
  window.scrollTo = jest.fn();
  render(<ProductCards/>);
  await waitFor(() => screen.getByText('Error in getting all the products'))
  expect(screen.getByText('Error in getting all the products')).toBeInTheDocument();
});
