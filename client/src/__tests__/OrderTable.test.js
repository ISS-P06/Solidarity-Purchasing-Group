import { render, screen } from '@testing-library/react';

import OrderTable from '../components/order/OrderTable';

describe('My component OrderTable', () => {
  test('Is Rendered', () => {
    const products = [
      {
        name: 'onion',
        quantity: 3,
        price: 1.15,
        unit: 'kg',
      },
      {
        name: 'apple',
        quantity: 4,
        price: 1.6,
        unit: 'kg',
      },
    ];

    render(<OrderTable products={products} />);

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
        price: 1.15,
      },
      {
        name: 'apple',
        quantity: 4,
        price: 1.6,
      },
    ];

    render(<OrderTable products={products} />);

    expect(screen.getByText(/Total € 9.85/)).toBeInTheDocument();
  });
});
