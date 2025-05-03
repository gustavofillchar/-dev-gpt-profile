import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ErrorComponent from '../error.component';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ErrorComponent', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders error message correctly', () => {
    const errorMessage = 'Test error message';
    render(<ErrorComponent message={errorMessage} />);

    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('navigates to home page when "Go Back" button is clicked', () => {
    render(<ErrorComponent message="Test error" />);

    const goBackButton = screen.getByText('Go Back');
    fireEvent.click(goBackButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('renders with correct styling classes', () => {
    render(<ErrorComponent message="Test error" />);

    const card = screen.getByTestId('error-card');
    expect(card).toHaveClass('w-full', 'max-w-md');

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('renders error icon', () => {
    render(<ErrorComponent message="Test error" />);
    
    const alertIcon = screen.getByTestId('alert-circle-icon');
    expect(alertIcon).toBeInTheDocument();
    expect(alertIcon).toHaveClass('h-4', 'w-4');
  });

  it('renders error message in alert description', () => {
    const testMessage = 'Custom error message';
    render(<ErrorComponent message={testMessage} />);
    
    const alertDescription = screen.getByTestId('alert-description');
    expect(alertDescription).toBeInTheDocument();
    expect(alertDescription).toHaveTextContent(testMessage);
  });

  it('renders card with correct layout structure', () => {
    render(<ErrorComponent message="Test error" />);
    
    expect(screen.getByTestId('error-card-header')).toBeInTheDocument();
    expect(screen.getByTestId('error-card-content')).toBeInTheDocument();
    expect(screen.getByTestId('error-card-footer')).toBeInTheDocument();
  });
}); 