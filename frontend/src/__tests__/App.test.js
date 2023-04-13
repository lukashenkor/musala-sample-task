import React from 'react'
import {render} from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders the App component', () => {
    const {getByText} = render(<App />);
    const linkElement = getByText(/gateways/i);
    expect(linkElement).toBeInTheDocument();
  })
})