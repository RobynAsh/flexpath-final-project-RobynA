import { render, screen } from '@testing-library/react'
import { Home } from './Home'

describe('Home', () => {
  test('renders its page label', () => {
    render(<Home />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
