import React from 'react';
import { render, screen } from '@testing-library/react';
import GatewayList from '../pages/GatewayList';
import Gateway from '../components/Gateway';
import { BrowserRouter } from 'react-router-dom';

describe('Gateway', () => {
  const gateway = {
    _id: '1',
    name: 'Gateway',
    ip4: '192.168.0.1',
    devices: [],
    serialNumber: '123'
  };

  it('renders the gateway card component with correct data', () => {
    const {getByText} = render(
      <BrowserRouter>
        <Gateway {...gateway} />
      </BrowserRouter>
    );
    

    // Assert that the gateway name is displayed
    expect(getByText(/Gateway/i)).toBeInTheDocument();

    // Assert that the gateway IPv4 is displayed
    expect(getByText(/192.168.0.1/i)).toBeInTheDocument();

    // Assert that the gateway serial number is displayed
    expect(getByText(/Serial number: 123/i)).toBeInTheDocument();
  });
});