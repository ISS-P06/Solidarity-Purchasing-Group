import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ReportAvailabilityProductsPage from "../components/farmer/ReportAvailabilityProductsPage"
import {SuppliedProductForm, SuppliedProducts} from "../components/farmer/ReportAvailabilityProductsPage"
import axios from 'axios';

jest.mock('../components/Message', () => ({
    addMessage: jest.fn(),
}));

jest.mock('axios');

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('test avaiability product component correct rendering', async () => {
    // add a runtime request handler
    server.use(
        rest.get('/api/farmer/3/products', (req, res, ctx) => {
            return res(
                ctx.json([
                    {
                        id: 1,
                        name: 'Baguette',
                        description: 'Delicious',
                        unit: 'Kg',
                    },
                ])
            );
        })
    );
    // add a runtime request handler
    server.use(
        rest.get('/api/farmer/3/products/supplied', (req, res, ctx) => {
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
    render(<ReportAvailabilityProductsPage user={jest.fn()}/>);
    const title1 = screen.getByText(/Your expected available product amounts for the next week/);
    expect(title1).toBeInTheDocument();

    const title2 = screen.getByText(/Add product amounts for the next week/);
    expect(title2).toBeInTheDocument();
    console.log(screen.debug())

});

test('test supplied product form correct rendering', async () => {
    // add a runtime request handler

    // test code
    render(<SuppliedProductForm productsList={[jest.fn()]} setDirty={jest.fn()}/>);
    const productName = screen.getByLabelText(/Name of the product/);
    userEvent.selectOptions(productName, '');

    const productQuantity = screen.getByLabelText(/Product quantity/);
    fireEvent.change(productQuantity, {target: {value: 10}});
    expect(productQuantity.value).toBe('10');

    const productPrice = screen.getByLabelText(/Price/);
    fireEvent.change(productPrice, {target: {value: 10}});
    expect(productPrice.value).toBe('10');

    expect(productName).toBeInTheDocument();

    const buttonSubmit = screen.getByText(/Add product available amounts/);
    fireEvent.click(buttonSubmit);
    server.use(
        rest.post('/api/farmer/products/available', (req, res, ctx) => {
            const {productID,quantity, price} = req.body;
            return res(
                ctx.status(200),
                ctx.json({}));
            expect(addMessage).toHaveBeenCalledTimes(1);
        })
    );
    await userEvent.click(screen.getByText(/Add product available amounts/));

});

test('test supplied products component correct rendering', async () => {

    // test code
    render(<SuppliedProducts suppliedProducts={[jest.fn()]}/>);
    const productName = screen.getByText(/Name/);
    expect(productName).toBeInTheDocument();

    const productQuantity = screen.getByText(/Quantity/);
    expect(productQuantity).toBeInTheDocument();

    const productPrice = screen.getByText(/Price/);
    expect(productPrice).toBeInTheDocument();


});
