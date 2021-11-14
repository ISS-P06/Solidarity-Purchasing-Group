import { render, screen, fireEvent} from "@testing-library/react";
import App from "../App";
import AppNavbar from "../components/AppNavbar";
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe("Test navbar appearance", () => {
    const doLogoutFn = jest.fn();

    test("The Navbar should appear when the App component is loaded", () => {
        render(<App/>);
        const navbar = screen.getByText("Solidarity Purchasing Group");
        expect(navbar).toBeInTheDocument();
    });

    test("Test Navbar appearance: user not logged in", () => {
        render(<AppNavbar
            loggedIn={false}
            doLogout={doLogoutFn}
            userRole={""}/>);

        const loginText = screen.getByText("Login");
        expect(loginText).toBeInTheDocument();

        fireEvent.click(screen.getByText("Login"));
    });

    test("Test Navbar appearance: user is logged in", () => {
        const history = createMemoryHistory();

        // mock push function
        history.push = jest.fn();

        render(
            <MemoryRouter history = {history}>
                <AppNavbar
                    loggedIn={true}
                    doLogout={doLogoutFn}
                    userRole={"shop_employee"}
                    />
            </MemoryRouter>);
        
        expect(screen.getByText("Employee page")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Logout"));

        fireEvent.click(screen.getByText("Employee page"));
    });
});
