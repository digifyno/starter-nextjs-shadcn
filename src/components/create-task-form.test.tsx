import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CreateTaskForm } from './create-task-form';

expect.extend(toHaveNoViolations);

describe('CreateTaskForm', () => {
  it('renders title input as required', () => {
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/title/i)).toHaveAttribute('aria-required', 'true');
  });

  it('renders description input', () => {
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('title input defaults to empty value', () => {
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
  });

  it('description input defaults to empty value', () => {
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
  });

  it('shows no validation error on initial render', () => {
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('title input has no aria-describedby before validation', () => {
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/title/i)).not.toHaveAttribute('aria-describedby');
  });

  it('shows validation error when title is empty on submit', async () => {
    const user = userEvent.setup();
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/title is required/i);
  });

  it('links title input to error message via aria-describedby after failed submit', async () => {
    const user = userEvent.setup();
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /create task/i }));
    const titleInput = screen.getByLabelText(/title/i);
    const errorMsg = screen.getByRole('alert');
    expect(titleInput).toHaveAttribute('aria-describedby', errorMsg.id);
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
    expect(onSubmit).toHaveBeenCalledWith({ title: 'My Task', description: '', priority: 'medium', category: 'feature' });
  });

  it('calls onSubmit with description when both fields are filled', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CreateTaskForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/title/i), 'My Task');
    await user.type(screen.getByLabelText(/description/i), 'A description');
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(onSubmit).toHaveBeenCalledWith({ title: 'My Task', description: 'A description', priority: 'medium', category: 'feature' });
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

  it('removes aria-describedby from title input after successful submit', async () => {
    const user = userEvent.setup();
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(screen.getByLabelText(/title/i)).toHaveAttribute('aria-describedby');
    await user.type(screen.getByLabelText(/title/i), 'Fixed Title');
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(screen.getByLabelText(/title/i)).not.toHaveAttribute('aria-describedby');
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

  it('title input does not have aria-invalid="true" initially', () => {
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/title/i)).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('title input has aria-invalid="true" when validation error is shown', async () => {
    const user = userEvent.setup();
    render(<CreateTaskForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(screen.getByLabelText(/title/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('has no axe accessibility violations on initial render', async () => {
    const { container } = render(<CreateTaskForm onSubmit={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe accessibility violations when showing validation error', async () => {
    const user = userEvent.setup();
    const { container } = render(<CreateTaskForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(await axe(container)).toHaveNoViolations();
  });

  describe('priority metadata', () => {
    it('renders priority select with default value medium', () => {
      render(<CreateTaskForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/priority/i)).toHaveValue('medium');
    });

    it('priority select has low, medium, and high options', () => {
      render(<CreateTaskForm onSubmit={vi.fn()} />);
      expect(screen.getByRole('option', { name: /^low$/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /^medium$/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /^high$/i })).toBeInTheDocument();
    });

    it('calls onSubmit with default priority medium', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CreateTaskForm onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/title/i), 'My Task');
      await user.click(screen.getByRole('button', { name: /create task/i }));
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ priority: 'medium' }));
    });

    it('calls onSubmit with selected priority high', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CreateTaskForm onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/title/i), 'My Task');
      await user.selectOptions(screen.getByLabelText(/priority/i), 'high');
      await user.click(screen.getByRole('button', { name: /create task/i }));
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ priority: 'high' }));
    });

    it('calls onSubmit with selected priority low', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CreateTaskForm onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/title/i), 'My Task');
      await user.selectOptions(screen.getByLabelText(/priority/i), 'low');
      await user.click(screen.getByRole('button', { name: /create task/i }));
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ priority: 'low' }));
    });

    it('priority select reflects change when updated', async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm onSubmit={vi.fn()} />);
      await user.selectOptions(screen.getByLabelText(/priority/i), 'high');
      expect(screen.getByLabelText(/priority/i)).toHaveValue('high');
      await user.selectOptions(screen.getByLabelText(/priority/i), 'medium');
      expect(screen.getByLabelText(/priority/i)).toHaveValue('medium');
    });

    it('calls onSubmit with all three metadata fields', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CreateTaskForm onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/title/i), 'Full Task');
      await user.type(screen.getByLabelText(/description/i), 'Full description');
      await user.selectOptions(screen.getByLabelText(/priority/i), 'high');
      await user.click(screen.getByRole('button', { name: /create task/i }));
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Full Task',
        description: 'Full description',
        priority: 'high',
      }));
    });
  });

  describe('category metadata', () => {
    it('renders category select', () => {
      render(<CreateTaskForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    });

    it('category select has feature, bugfix, docs, and refactor options', () => {
      render(<CreateTaskForm onSubmit={vi.fn()} />);
      expect(screen.getByRole('option', { name: /^feature$/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /^bugfix$/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /^docs$/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /^refactor$/i })).toBeInTheDocument();
    });

    it('category select defaults to feature', () => {
      render(<CreateTaskForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/category/i)).toHaveValue('feature');
    });

    it('calls onSubmit with default category feature', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CreateTaskForm onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/title/i), 'My Task');
      await user.click(screen.getByRole('button', { name: /create task/i }));
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ category: 'feature' }));
    });

    it('calls onSubmit with selected category bugfix', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CreateTaskForm onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/title/i), 'My Task');
      await user.selectOptions(screen.getByLabelText(/category/i), 'bugfix');
      await user.click(screen.getByRole('button', { name: /create task/i }));
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ category: 'bugfix' }));
    });

    it('calls onSubmit with selected category docs', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CreateTaskForm onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/title/i), 'My Task');
      await user.selectOptions(screen.getByLabelText(/category/i), 'docs');
      await user.click(screen.getByRole('button', { name: /create task/i }));
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ category: 'docs' }));
    });

    it('calls onSubmit with selected category refactor', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CreateTaskForm onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/title/i), 'My Task');
      await user.selectOptions(screen.getByLabelText(/category/i), 'refactor');
      await user.click(screen.getByRole('button', { name: /create task/i }));
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ category: 'refactor' }));
    });

    it('category select reflects change when updated', async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm onSubmit={vi.fn()} />);
      await user.selectOptions(screen.getByLabelText(/category/i), 'docs');
      expect(screen.getByLabelText(/category/i)).toHaveValue('docs');
      await user.selectOptions(screen.getByLabelText(/category/i), 'feature');
      expect(screen.getByLabelText(/category/i)).toHaveValue('feature');
    });

    it('calls onSubmit with all metadata fields including category', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CreateTaskForm onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/title/i), 'Full Task');
      await user.type(screen.getByLabelText(/description/i), 'Full description');
      await user.selectOptions(screen.getByLabelText(/priority/i), 'high');
      await user.selectOptions(screen.getByLabelText(/category/i), 'refactor');
      await user.click(screen.getByRole('button', { name: /create task/i }));
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Full Task',
        description: 'Full description',
        priority: 'high',
        category: 'refactor',
      });
    });
  });
});
