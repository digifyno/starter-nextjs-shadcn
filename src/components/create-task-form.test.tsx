import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTaskForm } from './create-task-form';

describe('CreateTaskForm', () => {
  it('renders title input as required', () => {
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/title/i)).toHaveAttribute('aria-required', 'true');
  });

  it('renders description input', () => {
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('shows validation error when title is empty on submit', async () => {
    const user = userEvent.setup();
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/title is required/i);
  });

  it('does not call onSubmit when title is empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CreateTaskForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with trimmed form data when title is filled', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CreateTaskForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/title/i), 'My Task');
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(onSubmit).toHaveBeenCalledWith({ title: 'My Task', description: '' });
  });

  it('calls onSubmit with description when both fields are filled', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CreateTaskForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/title/i), 'My Task');
    await user.type(screen.getByLabelText(/description/i), 'A description');
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(onSubmit).toHaveBeenCalledWith({ title: 'My Task', description: 'A description' });
  });

  it('clears validation error on successful re-submit', async () => {
    const user = userEvent.setup();
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.type(screen.getByLabelText(/title/i), 'Fixed Title');
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('does not submit whitespace-only title', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CreateTaskForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/title/i), '   ');
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/title is required/i);
  });
});
