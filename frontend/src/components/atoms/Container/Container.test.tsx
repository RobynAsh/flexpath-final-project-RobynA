import { render, screen } from '@testing-library/react'
import { Container } from './Container'

describe('Container', () => {
  test('renders children and merges custom classes', () => {
    render(<Container className="grow">Content</Container>)

    expect(screen.getByText('Content')).toHaveClass('container', 'grow')
  })
})
