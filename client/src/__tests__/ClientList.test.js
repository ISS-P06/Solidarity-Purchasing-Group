import { render, screen, fireEvent } from "@testing-library/react";
import { ClientsList, Client } from "../components/ClientsList.js";
import { ClientOrderForm } from "../components/ClientOrderForm.js";
import React from 'react';
import axios from 'axios';

jest.mock('axios');

test("test visualization of top up wallet", () => {
    render(<Client client={{ id: 1, name: "Mario", surname: "Rossi", address: "corso duca", balance: 100, id: 1, mail: "mario@rossi", phone: "3333333333" }} setMessage={{ msg: " ", type: "danger" }} />);

 
    const topUpButton = screen.getByText("Top up wallet");
    expect(topUpButton).toBeInTheDocument();
});

test("test visualization on add order button", () => {
    render(<Client client={{ id: 1, name: "Mario", surname: "Rossi", address: "corso duca", balance: 100, id: 1, mail: "mario@rossi", phone: "3333333333" }} setMessage={{ msg: " ", type: "danger" }} />);
    const addOrderButton = screen.getByText("Add order");
    expect(addOrderButton).toBeInTheDocument();
});

test("test click on top up wallet", () => {
    render(<Client client={{ id: 1, name: "Mario", surname: "Rossi", address: "corso duca", balance: 100, id: 1, mail: "mario@rossi", phone: "3333333333" }} setMessage={{ msg: " ", type: "danger" }} />);

    //Click on "Top up wallet" button to open the modal
    fireEvent(
        screen.getByText("Top up wallet"),
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        })
    )
});

/* test("test click on add order", () => {
    render(<Client client={{ id: 1, name: "Mario", surname: "Rossi", address: "corso duca",  balance: 100,  id: 1, mail: "mario@rossi",  phone:"3333333333"}} setMessage={{msg:" ", type:"danger"}}/>);
  
    //Click on "Add order" button to open the modal
    fireEvent(
      screen.getByText("Add order"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    )
}); */


test('fetches customers from an API and displays them', async () => {
    const customers = [
        { id: 1, name: "Mario", surname: "Rossi", address: "corso duca", balance: 100, id: 1, mail: "mario@rossi", phone: "3333333333" }
    ];

    axios.get.mockImplementationOnce(() =>
        Promise.resolve(customers)
    );

    render(<ClientsList setMessage={{ msg: " ", type: "danger" }} />);

});