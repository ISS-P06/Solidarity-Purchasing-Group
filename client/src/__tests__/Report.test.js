import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import React from 'react';

import Report from '../components/manager/Report';
import StatisticsTable from '../components/manager/StatisticsTable';
import CustomBarChart from '../components/manager/CustomBarChart';
import CustomPieChart from '../components/manager/CustomPieChart';

// add mock function for an external function
jest.mock('../components/Message', () => ({
    addMessage: jest.fn(),
}));

jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');

    return {
        ...OriginalModule,
        ResponsiveContainer: ({ height, children }) => (
            <OriginalModule.ResponsiveContainer width={800} height={800}>
                {children}
            </OriginalModule.ResponsiveContainer>
        ),
    };
});

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

let statsOk = {
    totalOrders: 100,
    deliveredOrders: 90,
    undeliveredOrders: 10,
    totalFood: 100,
    deliveredFood: 75,
    undeliveredFood: 25,
    perc_undeliveredOrd: 0.1,
    perc_deliveredOrd: 0.9,
    perc_undeliveredFood: 0.25,
    perc_deliveredFood: 0.75,
}

let statsKo = {
    totalOrders: 0,
    deliveredOrders: 0,
    undeliveredOrders: 0,
    totalFood: 0,
    deliveredFood: 0,
    undeliveredFood: 0,
    perc_undeliveredOrd: 0,
    perc_deliveredOrd: 0,
    perc_undeliveredFood: 0,
    perc_deliveredFood: 0,
}

describe('Report test', () => {
    test('test weekly report visualization', () => {
        render(<Report type="Weekly" virtualTime={new Date()} />);
        expect(screen.getByText('Weekly report for date:')).toBeInTheDocument();
    });
    test('test weekly fake report visualization', async () => {
        server.use(
            rest.post('/api/manager/report/weekly', (req, res, ctx) => {
                return res(ctx.json(statsOk));
            })
        );
        render(<Report type="Weekly" virtualTime={(new Date())} />);
        await waitFor(() => screen.getByText('90 %'));
        expect(screen.getByText('90 %')).toBeInTheDocument();
    });
    test('test monthly report visualization', () => {
        render(<Report type="Monthly" virtualTime={new Date()} />);
        expect(screen.getByText('Monthly report for date:')).toBeInTheDocument();
    });
    test('test monthly fake report visualization', async () => {
        server.use(
            rest.post('/api/manager/report/monthly', (req, res, ctx) => {
                return res(ctx.json(statsOk));
            })
        );
        render(<Report type="Monthly" virtualTime={(new Date())} />);
        await waitFor(() => screen.getByText('90 %'));
        expect(screen.getByText('90 %')).toBeInTheDocument();
    });
});

describe('StatisticTable test', () => {
    test('test statistics table for orders visualization', () => {
        render(<StatisticsTable stats={statsOk} type="Orders" />);
        expect(screen.getByText('90 %')).toBeInTheDocument();
    });
    test('test statistics table for orders visualization', () => {
        render(<StatisticsTable stats={statsOk} type="Food" />);
        expect(screen.getByText('75 %')).toBeInTheDocument();
    });
});

describe('CustomBarChart test', () => {
    test('test custom bar chart for orders visualization', () => {
        render(<CustomBarChart stats={statsOk} type="Orders" />);
        expect(screen.getByText('100')).toBeInTheDocument();
    });
    test('test no custom bar chart for orders visualization', () => {
        render(<CustomBarChart stats={statsKo} type="Orders" />);
        expect(screen.getByText('No orders data available.')).toBeInTheDocument();
    });
    test('test custom bar chart for food visualization', () => {
        render(<CustomBarChart stats={statsOk} type="Food" />);
        expect(screen.getByText('80')).toBeInTheDocument();
    });
    test('test no custom bar chart for food visualization', () => {
        render(<CustomBarChart stats={statsKo} type="Food" />);
        expect(screen.getByText('No food data available.')).toBeInTheDocument();
    });
});

describe('CustomPieChart test', () => {
    test('test custom pie chart for orders visualization', () => {
        render(<CustomPieChart stats={statsOk} type="Orders" />);
        expect(screen.getByText('10')).toBeInTheDocument();
    });
    test('test no custom pie chart for food visualization', () => {
        render(<CustomPieChart stats={statsKo} type="Orders" />);
        expect(screen.getByText('No orders data available.')).toBeInTheDocument();
    });
    test('test custom pie chart for food visualization', () => {
        render(<CustomPieChart stats={statsOk} type="Food" />);
        expect(screen.getByText('25')).toBeInTheDocument();
    });
    test('test no custom pie chart for food visualization', () => {
        render(<CustomPieChart stats={statsKo} type="Food" />);
        expect(screen.getByText('No food data available.')).toBeInTheDocument();
    });
});
