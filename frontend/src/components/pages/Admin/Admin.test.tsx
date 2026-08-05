import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Admin } from './Admin'

describe('Admin', () => {
  test('renders its page label', () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Admin />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Admin Portal' }),
    ).toBeInTheDocument()
  })
})
