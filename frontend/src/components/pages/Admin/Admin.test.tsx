import { render, screen } from '@testing-library/react'
import { Admin } from './Admin'

describe('Admin', () => {
  test('renders its page label', () => {
    render(<Admin />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
