import React from 'react';
import { render, screen } from '@testing-library/react';
import AlertBox from '../components/Message';
 
describe('App', () => {
  test('renders alert component', () => {
    render(<AlertBox alert={true} setAlert={(alert)=>(alert? true:false)} message={{msg:" ", type:"danger"}}/>);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
}); 