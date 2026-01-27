import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('closes when X button is clicked', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByTestId('modal-close-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when clicking directly on the backdrop', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    const backdrop = screen.getByTestId('modal-backdrop');

    // Simulate a direct click on the backdrop (mousedown and click on same element)
    fireEvent.mouseDown(backdrop, { target: backdrop });
    fireEvent.click(backdrop, { target: backdrop });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT close when clicking inside the modal content', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    const content = screen.getByTestId('modal-content');

    fireEvent.mouseDown(content);
    fireEvent.click(content);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('does NOT close when dragging from inside modal to backdrop', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    const content = screen.getByTestId('modal-content');
    const backdrop = screen.getByTestId('modal-backdrop');

    // Simulate drag: mousedown inside, mouseup (click) on backdrop
    fireEvent.mouseDown(content);
    fireEvent.click(backdrop, { target: backdrop });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('does NOT close when dragging from backdrop to inside modal', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    const content = screen.getByTestId('modal-content');
    const backdrop = screen.getByTestId('modal-backdrop');

    // Simulate drag: mousedown on backdrop, mouseup (click) inside
    fireEvent.mouseDown(backdrop, { target: backdrop });
    fireEvent.click(content);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders footer when provided', () => {
    render(
      <Modal {...defaultProps} footer={<button>Save</button>} />
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('does not render footer when not provided', () => {
    const { container } = render(<Modal {...defaultProps} />);
    // Footer has border-t class, check it's not there when no footer
    const footerDivs = container.querySelectorAll('.border-t');
    // Only header has border-b, footer would have border-t
    expect(footerDivs.length).toBe(0);
  });

  it('applies custom maxWidth', () => {
    render(<Modal {...defaultProps} maxWidth="max-w-sm" />);
    const content = screen.getByTestId('modal-content');
    expect(content.className).toContain('max-w-sm');
  });

  it('applies light mode styles when darkMode is false', () => {
    render(<Modal {...defaultProps} darkMode={false} />);
    const content = screen.getByTestId('modal-content');
    expect(content.className).toContain('bg-white');
  });

  it('applies dark mode styles by default', () => {
    render(<Modal {...defaultProps} />);
    const content = screen.getByTestId('modal-content');
    expect(content.className).toContain('bg-gray-800');
  });
});
