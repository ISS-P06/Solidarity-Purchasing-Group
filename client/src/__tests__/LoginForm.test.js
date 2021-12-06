import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import LoginForm from '../components/LoginForm';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe('Test login form', () => {
  test('Test login form appearance', async () => {
    render(<LoginForm doLogin={() => jest.fn()} />);

    const usernameField = screen.getByPlaceholderText('Username');
    const passwordField = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    expect(usernameField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('Test filling out login form', () => {
    const history = createMemoryHistory();

    // mock push function
    history.push = jest.fn();

    render(
      <MemoryRouter history={history}>
        <LoginForm doLogin={() => jest.fn} />
      </MemoryRouter>
    );

    //Click on the "Login" button without filling out fields
    act(() => {
      fireEvent.click(screen.getByText('Login'));
    });
    // Check for error messages
    expect(screen.getByText('Insert a username')).toBeInTheDocument();
    expect(screen.getByText('Insert a valid password')).toBeInTheDocument();

    // insert a password shorter than 8 characters
    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'p' },
      });
    });
    // Check for error message
    expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();

    // Fill out fields
    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'pentolino' },
      });
    });
    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'pentolino' },
      });
    });

    //Click on the "Login" button after filling out fields
    act(() => {
      fireEvent.click(screen.getByText('Login'));
    });
  });
});
