import BasketOffcanvas from '../containers/BasketOffcanvas'
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe("The component BasketOffcanvas", () => {
    test("Is Rendered", async () => {

        // Sunday; date inside intervale to make orders
        const date_in = new Date("December 5, 2021 17:00:00");

        render(<BasketOffcanvas userId={3} virtualTime={date_in} show={true} setShow={jest.fn()}/>);

        await userEvent.click(screen.getByTestId("basket-button"));
        
        expect(screen.getByText("Basket")).toBeInTheDocument();


    }); 
});