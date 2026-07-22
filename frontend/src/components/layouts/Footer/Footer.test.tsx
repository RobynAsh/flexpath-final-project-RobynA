import { render } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  test('renders its footer hook', () => {
    const { container } = render(<Footer />)
    expect(container.firstChild).toHaveClass('footer')
  })
})
