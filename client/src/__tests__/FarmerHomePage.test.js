import {render, screen, fireEvent, act, shallow} from '@testing-library/react';
import FarmerHomePage from "../components/farmer/FarmerHomePage";

describe('Test the farmer homepage component', () => {
    test('Test whether the farmer homepage  component renders properly', () => {
        render(

                <FarmerHomePage user={{}}/>
        );

        const title = screen.getByText(/Welcome on Solidarity Purchase Group/);
        expect(title).toBeInTheDocument();
        const text = screen.getByText(/We are happy to share your farm/);
        expect(text).toBeInTheDocument();

    });
});

