import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Input } from '../input'

describe('Input', () => {
  it('renders with label', () => {
    render(<Input id="test-input" label="Email" />)
    const label = screen.getByText('Email')
    const input = screen.getByLabelText('Email')
    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Input id="test-input" label="Email" error="Invalid email" />)
    const error = screen.getByText('Invalid email')
    expect(error).toBeInTheDocument()
    expect(error).toHaveAttribute('role', 'alert')
  })

  it('connects label to input via htmlFor', () => {
    render(<Input id="test-input" label="Email" />)
    const label = screen.getByText('Email')
    const input = screen.getByLabelText('Email')
    expect(label).toHaveAttribute('for', 'test-input')
    expect(input).toHaveAttribute('id', 'test-input')
  })

  it('handles onChange', () => {
    const handleChange = vi.fn()
    render(<Input id="test-input" onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies error styling when error is present', () => {
    render(<Input id="test-input" error="Error message" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('applies normal styling when no error', () => {
    render(<Input id="test-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-gray-300')
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('renders without label', () => {
    render(<Input id="test-input" placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(screen.queryByRole('label')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Input id="test-input" className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('renders disabled state', () => {
    render(<Input id="test-input" disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('bg-gray-100')
    expect(input).toHaveClass('cursor-not-allowed')
  })

  it('passes through HTML input attributes', () => {
    render(
      <Input
        id="test-input"
        type="email"
        placeholder="Enter email"
        required
      />
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('placeholder', 'Enter email')
    expect(input).toBeRequired()
  })

  it('associates error with input via aria-describedby', () => {
    render(<Input id="test-input" error="Error message" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-describedby', 'test-input-error')
    const error = screen.getByText('Error message')
    expect(error).toHaveAttribute('id', 'test-input-error')
  })
})
