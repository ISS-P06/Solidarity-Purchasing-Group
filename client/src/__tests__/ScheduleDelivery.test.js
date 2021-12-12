import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScheduleDelivery from '../components/client/scheduleDelivery';
import { createMemoryHistory } from 'history';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Router } from 'react-router-dom';

// add mock function for an external function
jest.mock('../components/Message', () => ({
    addMessage: jest.fn(),
  }));
  
const server = setupServer();
  
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('My component SchduleDelivery', () => {
    test('Is Rendered', async () => {
  
        render(<ScheduleDelivery orderID={1} />);
        
        const scheduleDeliveryButton = screen.getByText(/Schedule delivery/);
        expect(scheduleDeliveryButton).toBeInTheDocument();

        await userEvent.click(scheduleDeliveryButton);

        expect(screen.getByTestId('date-element')).toBeInTheDocument();
        expect(screen.getByTestId('time-element')).toBeInTheDocument();
        expect(screen.getByTestId('address-element')).toBeInTheDocument();

        expect(screen.getByTestId('close-element')).toBeInTheDocument();
        expect(screen.getByTestId('submit-element')).toBeInTheDocument();

        await userEvent.click(screen.getByTestId('close-element'));

    });

    test('schedules a delivery', async () => {

        let db = [];

        server.use(
            rest.post('/api/orders/1/deliver/schedule', (req, res, ctx) => {
                const delivery = req.body;
                console.log(req.body);
                db.push(delivery);
                return res(ctx.status(200));
            })
        );
        
        const history = createMemoryHistory();

        // mock push function
        history.push = jest.fn();

        render(<Router history={history}><ScheduleDelivery orderID={1} /></Router>);
        
        const scheduleDeliveryButton = screen.getByText(/Schedule delivery/);
        expect(scheduleDeliveryButton).toBeInTheDocument();

        await userEvent.click(scheduleDeliveryButton);
        
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
        
        await waitFor(() => {expect(db).toHaveLength(1)});
    
    });

});
