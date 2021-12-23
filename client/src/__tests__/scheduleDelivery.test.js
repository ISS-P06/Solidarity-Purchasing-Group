import React from 'react';
import {render, screen, waitFor,fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScheduleDelivery from '../components/client/scheduleDelivery';
import {createMemoryHistory} from 'history';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {Router} from 'react-router-dom';

// add mock function for an external function
jest.mock('../components/Message', () => ({
    addMessage: jest.fn(),
}));

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('My component ScheduleDelivery', () => {
    test('Is Rendered', async () => {

        render(<ScheduleDelivery orderID={1}  show={true} setShow={jest.fn()} virtualTime={jest.fn()}/>);

        await waitFor(() => screen.getByText(/Submit/));
        expect(screen.getByText(/Submit/)).toBeInTheDocument();

        await userEvent.click(screen.getByText(/Submit/));

        expect(screen.getByText('Delivery at home')).toBeInTheDocument();
        expect(screen.getByText('Pick up in store')).toBeInTheDocument();
        expect(screen.getByTestId('date-element')).toBeInTheDocument();
        expect(screen.getByTestId('time-element')).toBeInTheDocument();
        expect(screen.getByTestId('address-element')).toBeInTheDocument();

        expect(screen.getByTestId('submit-element')).toBeInTheDocument();


    });

    test('schedules a delivery at home', async () => {

        let db = [];

        server.use(
            rest.post('/api/orders/1/deliver/schedule', (req, res, ctx) => {
                const delivery = req.body;
                db.push(delivery);
                return res(ctx.status(200));
            })
        );

        const history = createMemoryHistory();

        // mock push function
        history.push = jest.fn();

        render(<Router history={history}><ScheduleDelivery orderID={1} show={true} setShow={jest.fn()} virtualTime={jest.fn()}/></Router>);

     const scheduleDeliveryButton = screen.getByText(/Submit/);
        expect(scheduleDeliveryButton).toBeInTheDocument();

       await userEvent.click(scheduleDeliveryButton);

        screen.debug()

        fireEvent.click(screen.getAllByRole("radio")[0])
        expect(screen.getAllByRole("radio")[0].checked).toEqual(true);

        const dateElement = screen.getByTestId('date-element')
        expect(dateElement).toBeInTheDocument();
        userEvent.type(dateElement, "2022-01-01");

        const timeElement = screen.getByTestId('time-element')
        expect(timeElement).toBeInTheDocument();
        userEvent.type(timeElement, '12:00');

        const addressElement = screen.getByTestId('address-element')
        expect(addressElement).toBeInTheDocument();
        userEvent.type(addressElement, 'Via San Paolo, 34');

        await userEvent.click(screen.getByTestId('submit-element'));

        await waitFor(() => {
            expect(db).toHaveLength(1)
        });

    });

    test('schedules a pickup', async () => {

        let db = [];

        server.use(
            rest.post('/api/orders/1/deliver/schedule', (req, res, ctx) => {
                const delivery = req.body;
                db.push(delivery);
                return res(ctx.status(200));
            })
        );

        const history = createMemoryHistory();

        // mock push function
        history.push = jest.fn();

        render(<Router history={history}><ScheduleDelivery orderID={1} show={true} setShow={jest.fn()} virtualTime={jest.fn()}/></Router>);

        const scheduleDeliveryButton = screen.getByText(/Submit/);
        expect(scheduleDeliveryButton).toBeInTheDocument();

        await userEvent.click(scheduleDeliveryButton);

        screen.debug()

        fireEvent.click(screen.getAllByRole("radio")[1])
        expect(screen.getAllByRole("radio")[1].checked).toEqual(true);

        const dateElement = screen.getByTestId('date-element')
        expect(dateElement).toBeInTheDocument();
        userEvent.type(dateElement, "2022-01-01");

        const timeElement = screen.getByTestId('time-element')
        expect(timeElement).toBeInTheDocument();
        userEvent.type(timeElement, '12:00');


        await userEvent.click(screen.getByTestId('submit-element'));

        await waitFor(() => {
            expect(db).toHaveLength(1)
        });

    });

});