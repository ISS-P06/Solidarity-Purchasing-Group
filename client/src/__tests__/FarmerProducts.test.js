import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { FarmerProducts } from '../components/farmer';

describe('FarmerProducts', () => {

    const history = createMemoryHistory();
    history.push = jest.fn();

    test('test FarmerProducts component rendering', () => {

        render(<Router history={history}><FarmerProducts /></Router>);
        const addButton = screen.getByText('Add new product');
        expect(addButton).toBeInTheDocument();

    });

});
