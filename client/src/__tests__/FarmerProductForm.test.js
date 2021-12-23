import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FarmerProductForm } from '../components/farmer';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

// add mock function for an external function
jest.mock('../components/Message', () => ({
    addMessage: jest.fn(),
}));
describe('FarmerProductForm', () => {

    const history = createMemoryHistory();
    history.push = jest.fn();

    test('test FarmerProductForm component rendering', () => {

        render(<Router history={history}><FarmerProductForm user={{userId:3}} show={jest.fn()} handleClose={jest.fn()}w/></Router>);

        const title = screen.getByText('Add new product');
        expect(title).toBeInTheDocument();

        const descriptionField = screen.getByText('Description of the product');
        expect(descriptionField).toBeInTheDocument();


    });

    test('test FarmerProductForm component change input value', () => {

        render(<Router history={history}><FarmerProductForm user={{userId:3}} show={jest.fn()} handleClose={jest.fn()} /></Router>);

        const inputName = screen.getByLabelText('Name of the product');
        fireEvent.change(inputName, { target: { value: 'Potatoes' } });
        expect(inputName.value).toBe('Potatoes');

        const inputDescription = screen.getByLabelText('Description of the product');
        fireEvent.change(inputDescription, { target: { value: 'Very natural potatoes!' } });
        expect(inputDescription.value).toBe('Very natural potatoes!');

        const inputCategory = screen.getByLabelText('Category');
        fireEvent.change(inputCategory, { target: { value: 'Food items' } });
        expect(inputCategory.value).toBe('Food items');

        const inputUnit = screen.getByLabelText('Unit');
        fireEvent.change(inputUnit, { target: { value: 'lt' } });
        expect(inputUnit.value).toBe('lt');


    });

    test('test FarmerProductForm component wrong submit', () => {

        render(<Router history={history}><FarmerProductForm user={{userId:3}} show={jest.fn()} handleClose={jest.fn()} /></Router>);

        const submitButton = screen.getByText('Add product');
        fireEvent.click(submitButton);

    });

    test('test FarmerProductForm component right submit', () => {

        render(<Router history={history}><FarmerProductForm user={{userId:3}} show={jest.fn()} handleClose={jest.fn()}/></Router>);

        const inputName = screen.getByLabelText("Name of the product");
        fireEvent.change(inputName, { target: { value: 'Potatoes' } });
        const inputDescription = screen.getByLabelText("Description of the product");
        fireEvent.change(inputDescription, { target: { value: 'Very natural potatoes!' } });

        const submitButton = screen.getByText("Add product");
        fireEvent.click(submitButton);

    });
});
