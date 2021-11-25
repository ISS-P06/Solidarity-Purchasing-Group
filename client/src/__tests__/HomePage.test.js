import {render, screen, fireEvent, act} from '@testing-library/react';
import HomePage from '../containers/HomePage';

describe('Test the Homepage component', () => {
    test('Test whether the Homepage component renders properly', () => {
        render(<HomePage/>);
        const title = screen.getByText('Welcome on Solidarity Purchase Group!');
        expect(title).toBeInTheDocument();
        const feautures = screen.getByText('Check out our new features!');
        expect(feautures).toBeInTheDocument();
     /*   const carouselItems = screen.getAllByRole('carousel-item');
        for (var ci of carouselItems) {
            expect(ci).toBeInTheDocument();
        }
        const icons = screen.getAllByRole('icon');
        for (var ic of icons) {
            expect(ic).toBeInTheDocument();
        }*/
        const images = screen.getAllByRole('img');
        for (var image of images) {
            expect(image).toBeInTheDocument();
        }

    });
});

