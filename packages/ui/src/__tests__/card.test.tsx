import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from '../card'

describe('Card', () => {
  it('renders with title and description', () => {
    render(
      <Card title="Test Title" description="Test Description">
        <p>Content</p>
      </Card>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <Card>
        <p>Child content</p>
        <span>More content</span>
      </Card>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
    expect(screen.getByText('More content')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(
      <Card footer={<button>Action</button>}>
        <p>Content</p>
      </Card>
    )
    const button = screen.getByRole('button', { name: 'Action' })
    expect(button).toBeInTheDocument()
  })

  it('renders without title', () => {
    render(
      <Card description="Description only">
        <p>Content</p>
      </Card>
    )
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('Description only')).toBeInTheDocument()
  })

  it('renders without description', () => {
    render(
      <Card title="Title only">
        <p>Content</p>
      </Card>
    )
    expect(screen.getByText('Title only')).toBeInTheDocument()
  })

  it('renders without header when title and description are not provided', () => {
    render(
      <Card>
        <p>Content</p>
      </Card>
    )
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders without footer when footer is not provided', () => {
    render(
      <Card title="Title">
        <p>Content</p>
      </Card>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <p>Content</p>
      </Card>
    )
    const card = container.firstChild
    expect(card).toHaveClass('custom-class')
  })

  it('renders complete card with all sections', () => {
    render(
      <Card
        title="Complete Card"
        description="This card has everything"
        footer={<button>Footer Button</button>}
      >
        <div>Main Content</div>
      </Card>
    )
    expect(screen.getByText('Complete Card')).toBeInTheDocument()
    expect(screen.getByText('This card has everything')).toBeInTheDocument()
    expect(screen.getByText('Main Content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Footer Button' })).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = render(
      <Card title="Styled Card">
        <p>Content</p>
      </Card>
    )
    const card = container.firstChild
    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('rounded-lg')
    expect(card).toHaveClass('shadow-md')
    expect(card).toHaveClass('border')
  })
})
