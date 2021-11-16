import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ClientTopUpForm from '../components/client/ClientTopUpForm';

describe('ClientTopUpForm', () => {
  // mock client
  const client = {
    id: 1,
    name: 'Mario',
    surname: 'Rossi',
    address: 'corso duca',
    balance: 100,
    id: 1,
    mail: 'mario@rossi',
    phone: '3333333333',
  };

  test('test ClientTopUpForm component rendering', () => {
    const props = {
      client,
      show: true,
    };

    render(<ClientTopUpForm {...props} />);

    const title = screen.getByText(`Top up ${client.name} ${client.surname}'s wallet`);
    expect(title).toBeInTheDocument();

    const clientBalance = screen.getByText(`$ ${client.balance.toFixed(2)}`);
    expect(clientBalance).toBeInTheDocument();

    const inputForm = screen.getByText(/Insert top up/);
    expect(inputForm).toBeInTheDocument();

    const buttonSubmit = screen.getByText('Confirm');
    expect(buttonSubmit).toBeInTheDocument();

    const buttonCancel = screen.getByText('Cancel');
    expect(buttonCancel).toBeInTheDocument();
  });

  test('test ClientTopUpForm component submit', () => {
    const props = {
      client,
      show: true,
      topUpClient: jest.fn(),
      setMessage: jest.fn(),
      handleClose: jest.fn(),
    };

    render(<ClientTopUpForm {...props} />);

    const buttonSubmit = screen.getByText('Confirm');
    fireEvent.click(buttonSubmit);

    expect(props.topUpClient).toHaveBeenCalledTimes(1);
    expect(props.setMessage).toHaveBeenCalledTimes(1);
    expect(props.handleClose).toHaveBeenCalledTimes(1);
  });

  test('test ClientTopUpForm component close', () => {
    const props = {
      client,
      show: true,
      handleClose: jest.fn(),
    };

    render(<ClientTopUpForm {...props} />);

    const buttonCancel = screen.getByText('Cancel');
    fireEvent.click(buttonCancel);

    expect(props.handleClose).toHaveBeenCalledTimes(1);

    const buttonClose = screen.getByLabelText('Close');
    fireEvent.click(buttonClose);

    expect(props.handleClose).toHaveBeenCalledTimes(2);
  });

  test('test ClientTopUpForm component change input value', () => {
    const props = {
      client,
      show: true,
    };

    render(<ClientTopUpForm {...props} />);

    const inputForm = screen.getByLabelText('Insert top up');
    fireEvent.change(inputForm, { target: { value: 50 } });

    expect(inputForm.value).toBe('50');
  });
});
