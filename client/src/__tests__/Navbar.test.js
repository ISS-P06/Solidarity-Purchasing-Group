import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { default as AppNavbar } from '../containers/Navbar';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe('Test navbar appearance', () => {
  const doLogoutFn = jest.fn();

  test('The Navbar should appear when the App component is loaded', () => {
    render(<App />);
    const navbar = screen.getByText('SPG');
    expect(navbar).toBeInTheDocument();
  });

  test('Test Navbar appearance: user not logged in', () => {
    const history = createMemoryHistory();

    // mock push function
    history.push = jest.fn();

    render(
      <MemoryRouter history={history}>
        <AppNavbar loggedIn={false} doLogout={doLogoutFn} userRole={''} />
      </MemoryRouter>
    );

    const dropdown = screen.getByTestId('settings-dd');
    expect(dropdown).toBeInTheDocument();

    fireEvent.click(dropdown);

    // screen.getByRole('');
    const login = screen.getByText(/Login/);
    expect(login).toBeInTheDocument();
  });

  test('Test Navbar appearance: user is logged in', () => {
    const history = createMemoryHistory();

    // mock push function
    history.push = jest.fn();

    render(
      <MemoryRouter history={history}>
        <AppNavbar loggedIn={true} doLogout={doLogoutFn} userRole={'shop_employee'} />
      </MemoryRouter>
    );

    const dropdown = screen.getByTestId('settings-dd');
    expect(dropdown).toBeInTheDocument();
    fireEvent.click(dropdown);

    const logout = screen.getByText(/Logout/);
    expect(logout).toBeInTheDocument();

    fireEvent.click(logout);
    expect(doLogoutFn).toHaveBeenCalledTimes(1);
  });
});
