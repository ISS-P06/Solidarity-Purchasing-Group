import { render, screen, fireEvent } from "@testing-library/react";
import { ClientOrderForm, ProductForm } from "../components/ClientOrderForm.js";
import React from 'react';
import axios from 'axios';

jest.mock('axios');

/* test('fetches products from an API and displays them', async () => {
    const products= [ {id: 1, name: "lemon", description: "lemon", category: "fruits and vegetables", description: "lemon", id: 1, name: "lemon", price: 1.2, quantity: 0} ];

    axios.get.mockImplementationOnce(() =>
        Promise.resolve(products)
    );

    render(<ClientOrderForm  show={true}
        onHide={() => false}
        client={{ id: 1, name: "Mario", surname: "Rossi", address: "corso duca", balance: 100, id: 1, mail: "mario@rossi", phone: "3333333333" }} setMessage={{ msg: " ", type: "danger" }} />);

});
  */

/* test("test visualization of the button to add a product", () => {
    render(
    <ProductForm key={0} temporaryKey={0} setTemporaryKey={1} insertProduct={true} setInsertProduct={()=>{}} partialPrice={0.0} setPartialPrice={()=>{}} productsList={[{id: 1, name: "lemon", description: "lemon", category: "fruits and vegetables", description: "lemon", id: 1, name: "lemon", price: 1.2, quantity: 0}]} setProductsList={()=>{}} productsClient={[]} setProductsClient={()=>{}}  categoriesList={["fruits and vegetables", "dairy product", "meats_cold_cuts","pasta_and_rice","bread","food_items"]}/>);
    screen.debug();
    const addProductButton = screen.getByText("Add product");
    expect(addProductButton).toBeInTheDocument();
}); */