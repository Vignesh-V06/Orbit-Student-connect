import { render, screen } from '@testing-library/react';
import App from './App';

test('renders orbit lite heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Orbit Lite/i);
  expect(headingElement).toBeInTheDocument();
});

