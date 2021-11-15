import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderTable from '../components/OrderTable';

describe('My component OrderTable', () => {
    test('Is Rendered', () => {

        const products = [
            {
                name: 'onion',
                quantity: 3,
                price: 1.15
            },
            {
                name: 'apple',
                quantity: 4,
                price: 1.60
            }
        ]

        render(<OrderTable products={products}/>);
        
        expect(screen.getByText('onion')).toBeInTheDocument();
        expect(screen.getByText('apple')).toBeInTheDocument();
        
    });
  });

  describe('My function computeTotal()', () => {
    test('give the right result', () => {

        const products = [
            {
                name: 'onion',
                quantity: 3,
                price: 1.15
            },
            {
                name: 'apple',
                quantity: 4,
                price: 1.60
            }
        ]

        render(<OrderTable products={products}/>);
        
        expect(screen.getByText('€ 9.85')).toBeInTheDocument();
        
    });
  });
