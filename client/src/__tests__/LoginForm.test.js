import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from 'react-dom/test-utils';
import LoginForm from "../components/LoginForm";

describe("Test login form", () => {
    test("Test login form appearance", async () => {
        render(<LoginForm
            doLogin={() => jest.fn()}/>);

        const usernameField = screen.getByPlaceholderText("Username");
        const passwordField = screen.getByPlaceholderText("Password");
        const loginButton = screen.getByText("Login");
        const homeButton = screen.getByText("Back to home");

        expect(usernameField).toBeInTheDocument();
        expect(passwordField).toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();
        expect(homeButton).toBeInTheDocument();
    });    

    test("Test filling out login form", () => {
        render(<LoginForm
            doLogin={() => jest.fn}/>);

        //Click on the "Login" button without filling out fields
        act(() => {fireEvent.click(screen.getByText("Login"))});

        // Fill out fields
        act(() => {fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: 'pentolino' },
          })});
        act(() => {fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: 'pentolino' },
          })});

        //Click on the "Login" button after filling out fields
        act(() => {fireEvent.click(screen.getByText("Login"))});
    });
});
