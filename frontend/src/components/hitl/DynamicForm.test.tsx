import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DynamicForm from '../DynamicForm'

describe('DynamicForm', () => {
  it('should render form with title', () => {
    const schema = {
      title: 'Test Form',
      fields: [{ type: 'text' as const, key: 'name', label: 'Name' }],
    }
    render(<DynamicForm schema={schema} onSubmit={vi.fn()} />)
    expect(screen.getByText('Test Form')).toBeInTheDocument()
  })

  it('should render text input fields', () => {
    const schema = {
      title: 'Form',
      fields: [
        { type: 'text' as const, key: 'email', label: 'Email', placeholder: 'Enter email' },
      ],
    }
    render(<DynamicForm schema={schema} onSubmit={vi.fn()} />)
    const input = screen.getByPlaceholderText('Enter email')
    expect(input).toBeInTheDocument()
  })

  it('should render textarea fields', () => {
    const schema = {
      title: 'Form',
      fields: [{ type: 'textarea' as const, key: 'message', label: 'Message' }],
    }
    render(<DynamicForm schema={schema} onSubmit={vi.fn()} />)
    const textarea = screen.getByDisplayValue('')
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('should render multi-select fields', () => {
    const schema = {
      title: 'Form',
      fields: [
        {
          type: 'multi-select' as const,
          key: 'colors',
          label: 'Colors',
          options: ['Red', 'Blue', 'Green'],
        },
      ],
    }
    render(<DynamicForm schema={schema} onSubmit={vi.fn()} />)
    expect(screen.getByText('Red')).toBeInTheDocument()
  })

  it('should call onSubmit with form values', () => {
    const onSubmit = vi.fn()
    const schema = {
      title: 'Form',
      fields: [{ type: 'text' as const, key: 'name', label: 'Name' }],
    }
    render(<DynamicForm schema={schema} onSubmit={onSubmit} />)
    const input = screen.getByDisplayValue('') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'John' } })
    const button = screen.getByRole('button', { name: /approve/i })
    fireEvent.click(button)
    expect(onSubmit).toHaveBeenCalledWith({ name: 'John' })
  })

  it('should handle field value changes', () => {
    const onSubmit = vi.fn()
    const schema = {
      title: 'Form',
      fields: [
        { type: 'text' as const, key: 'field1', label: 'Field 1' },
        { type: 'text' as const, key: 'field2', label: 'Field 2' },
      ],
    }
    render(<DynamicForm schema={schema} onSubmit={onSubmit} />)
    const inputs = screen.getAllByDisplayValue('')
    fireEvent.change(inputs[0], { target: { value: 'Value1' } })
    fireEvent.change(inputs[1], { target: { value: 'Value2' } })
    const button = screen.getByRole('button', { name: /approve/i })
    fireEvent.click(button)
    expect(onSubmit).toHaveBeenCalledWith({ field1: 'Value1', field2: 'Value2' })
  })
})
