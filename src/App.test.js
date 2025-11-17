import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import App from './App';

test('renders App component without crashing', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  // You can add a more meaningful test here, e.g.,
  // expect(screen.getByAltText(/logo header/i)).toBeInTheDocument();
});