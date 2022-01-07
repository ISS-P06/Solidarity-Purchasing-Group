import { render, screen, waitFor } from '@testing-library/react';
import ManagerHomePage from "../components/manager/ManagerHomePage";
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// add mock function for an external function
jest.mock('../components/Message', () => ({
    addMessage: jest.fn(),
}));

// mock server setup
const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Test the manager homepage component', () => {
    test('test the manager homepage titles correct rendering', () => {
        render(<ManagerHomePage />);
        const title = screen.getByText(/Welcome to SPG manager area/);
        expect(title).toBeInTheDocument();
        const usersText = screen.getByText(/Users stats:/);
        expect(usersText).toBeInTheDocument();
        const ordersText = screen.getByText(/Orders stats:/);
        expect(ordersText).toBeInTheDocument();
    });
    test('test the manager homepage stats correct rendering', async () => {
        server.use(
            rest.get('/api/manager/stats', (req, res, ctx) => {
                return res(ctx.json(
                    {
                        userStats: {
                            client: 1,
                            farmer: 2,
                            manager: 3,
                            shop_employee: 4,
                        },
                        numOrders: 5,
                        numFarmers: 6,
                    }
                ));
            })
        );
        render(<ManagerHomePage />);
        await waitFor(() => screen.getByText('5'));
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
    });
});
