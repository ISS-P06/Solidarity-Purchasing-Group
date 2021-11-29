import { render, screen, fireEvent } from '@testing-library/react';
import ClientHomePage from '../components/client/ClientHomePage';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

describe('Test the client homepage component', () => {
  test('Test whether the client homepage  component renders properly', () => {
    const user = { name: 'ciao' };
    const history = createMemoryHistory();

    // mock push function
    history.push = jest.fn();

    render(
      <Router history={history}>
        <ClientHomePage user={user} />
      </Router>
    );

    const title = screen.getByText(/Welcome on Solidarity Purchase Group/);
    expect(title).toBeInTheDocument();
    const balance = screen.getByText(/Your current balance is/);
    expect(balance).toBeInTheDocument();
    const actions = screen.getByText('What would you like to do?');
    expect(actions).toBeInTheDocument();
    const option = screen.getByText('Choose one of the options below by clicking on the images!');
    expect(option).toBeInTheDocument();
    const images = screen.getAllByRole('img');
    for (var image of images) {
      expect(image).toBeInTheDocument();
    }

    fireEvent(
      screen.getByText(/Add products to my basket/),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
  });
});
