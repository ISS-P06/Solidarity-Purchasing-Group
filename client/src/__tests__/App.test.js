import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import App from "../App";
import { createMemoryHistory } from 'history';

describe("Test the App component", () => {
  test("Test whether the App component renders properly", () => {
    render(<App />);
    const navBar = screen.getByText("Solidarity Purchasing Group");
    expect(navBar).toBeInTheDocument();
  });  
});

describe("Test routes", () => {
  test("Test routes", () => {
    render (
      <MemoryRouter>
        <App/>
      </MemoryRouter>
    );

    const navBar = screen.getByText("Solidarity Purchasing Group");
    expect(navBar).toBeInTheDocument();
    // check whether the navbar loads correctly
    const loginLink = screen.getByText("Login");
    expect(loginLink).toBeInTheDocument();
  });
});