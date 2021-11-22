import React from 'react';
import { render, screen } from '@testing-library/react';
import Notification from '../components/Message';

describe('Alert', () => {
  test('renders alert component', () => {
    render(
      <Notification
        alert={true}
        setAlert={(alert) => (alert ? true : false)}
        message={{ msg: ' ', type: 'danger' }}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
