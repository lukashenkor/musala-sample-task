import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Device from '../components/Device';

describe('Device', () => {
  const device = {
    _id: '1',
    uid: 987654321,
    vendor: 'vendor1',
    gateway: null,
    status: false,
  };

  it('renders the device card component with correct data', () => {
    const {getByText} = render(
      <BrowserRouter>
        <Device {...device} />
      </BrowserRouter>
    );
    
    // Assert that the gateway name is displayed
    expect(getByText(/987654321/i)).toBeInTheDocument();

    // Assert that the gateway IPv4 is displayed
    expect(getByText(/vendor1/i)).toBeInTheDocument();

    // Assert that the gateway serial number is displayed
    expect(getByText(/Offline/i)).toBeInTheDocument();

  });
});