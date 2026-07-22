import { render, screen } from '@testing-library/react'
import { DashBorder } from './DashBorder'

describe('DashBorder', () => {
  test('renders content between two decorative borders', () => {
    const { container } = render(<DashBorder>or</DashBorder>)

    expect(screen.getByText('or')).toBeInTheDocument()
    expect(container.querySelectorAll('.border-dashed')).toHaveLength(2)
  })
})
