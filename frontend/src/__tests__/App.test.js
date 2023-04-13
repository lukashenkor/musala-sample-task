import React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import App from '../App'
import { Provider } from 'react-redux';
import {store} from '../app/store';
import { BrowserRouter } from 'react-router-dom';
import GatewayList from '../pages/GatewayList';

// const axios = require('axios');

jest.mock('axios');

/* test('displays list of gateways after successful API call', async () => {
  const data = [
    { _id: '1', name: 'Gateway 1', ipv4: '192.168.0.1', devices: [], serialNumber: '123' },
    { _id: '2', name: 'Gateway 2', ipv4: '192.168.0.2', devices: [], serialNumber: '124' },
  ];
  axios.get.mockResolvedValue({ data });
  render(<GatewayList />);

  // Assert that the loading indicator is displayed
  expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();

  // Wait for the API call to finish and the data to be rendered
  await waitFor(() => {
    expect(screen.queryByTestId('loading-indicator')).toBeNull();
    expect(screen.getByText('Gateway 1')).toBeInTheDocument();
    expect(screen.getByText('Gateway 2')).toBeInTheDocument();
  });
}); */


describe('App', () => {
  it('renders the App component', () => {
    const {getByText} = render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    const linkElement = getByText(/gateways/i);
    expect(linkElement).toBeInTheDocument();
  })

  it('opens gateways page after gateways NavLink click', () => {
    const {getByText, getByTestId} = render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    const linkElement = getByText(/Gateways/i);
    fireEvent.click(linkElement);
    const loadingMessage = getByText(/Loading.../i);
    expect(loadingMessage).toBeInTheDocument();
  })
})