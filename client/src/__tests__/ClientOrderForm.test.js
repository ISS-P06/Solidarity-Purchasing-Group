import { render, screen } from '@testing-library/react';
import React from 'react';
import axios from 'axios';

import ClientOrderForm, { ProductForm } from '../components/client/ClientOrderForm';

// add mock function for an external function
jest.mock('../components/Message', () => ({
  addMessage: jest.fn(),
}));

jest.mock('axios');

describe('ClientOrderForm', () => {
  test('fetches products from an API and displays them', async () => {
    const products = [
      {
        id: 1,
        name: 'lemon',
        description: 'lemon',
        category: 'fruits and vegetables',
        price: 1.2,
        quantity: 0,
      }
    ];

    axios.get.mockImplementationOnce(() => Promise.resolve(products));

    render(
      <ClientOrderForm
        show={true}
        onHide={() => false}
        client={{
          id: 1,
          name: 'Mario',
          surname: 'Rossi',
          address: 'corso duca',
          balance: 100,
          mail: 'mario@rossi',
          phone: '3333333333',
        }}
      />
    );
  });

  test('test visualization of the form to add a product', () => {
    render(
      <ProductForm
        key={0}
        temporaryKey={0}
        setTemporaryKey={1}
        insertProduct={true}
        setInsertProduct={() => {}}
        partialPrice={0.0}
        setPartialPrice={() => {}}
        productsList={[
          {
            id: 1,
            name: 'lemon',
            description: 'lemon',
            category: 'fruits and vegetables',
            price: 1.2,
            quantity: 0,
          },
        ]}
        setProductsList={() => {}}
        productsClient={[]}
        setProductsClient={() => {}}
        categoriesList={[
          'fruits and vegetables',
          'dairy product',
          'meats_cold_cuts',
          'pasta_and_rice',
          'bread',
          'food_items',
        ]}
      />
    );

    const comboItems = screen.getAllByRole('combobox');
    for (var combo of comboItems) {
      expect(combo).toBeInTheDocument();
    }

    const optionItems = screen.getAllByRole('option');
    for (var option of optionItems) {
      expect(option).toBeInTheDocument();
    }

    const spinButton = screen.getByRole('spinbutton');
    expect(spinButton).toBeInTheDocument();

    const addProductButton = screen.getByText('Add product');
    expect(addProductButton).toBeInTheDocument();

    const categoryLabel = screen.getByLabelText('Category');
    expect(categoryLabel).toBeInTheDocument();

    const productLabel = screen.getByLabelText('Product');
    expect(productLabel).toBeInTheDocument();

    const quantityLabel = screen.getByLabelText('Quantity');
    expect(quantityLabel).toBeInTheDocument();
  });

  test('test visualization of the modal', () => {
    render(
      <ClientOrderForm
        show={true}
        onHide={() => false}
        client={{
          id: 1,
          name: 'Mario',
          surname: 'Rossi',
          address: 'corso duca',
          balance: 100,
          mail: 'mario@rossi',
          phone: '3333333333',
        }}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const addProductButton = screen.getByText('Add order');
    expect(addProductButton).toBeInTheDocument();

    const CloseButton = screen.getByText('Close');
    expect(CloseButton).toBeInTheDocument();

    const addNewClientOrderLabel = screen.getByText('Add a new client order');
    expect(addNewClientOrderLabel).toBeInTheDocument();
  });
});
