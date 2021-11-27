import {render, screen, fireEvent, act} from '@testing-library/react';
import HomePage from '../containers/HomePage';

describe('Test the client homepage component', () => {
    test('Test whether the client homepage component renders properly', () => {
        render(<HomePage/>);
        const title = screen.getByText('Welcome on Solidarity Purchase Group!');
        expect(title).toBeInTheDocument();
        const feautures = screen.getByText('Check out our new features!');
        expect(feautures).toBeInTheDocument();
        const images = screen.getAllByRole('img');
        for (var image of images) {
            expect(image).toBeInTheDocument();
        }
    });
});

