import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HeaderNavLink } from './HeaderNavLink'

describe('HeaderNavLink', () => {
  test('renders content and links to its destination', () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <HeaderNavLink to="/profile">Profile</HeaderNavLink>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute(
      'href',
      '/profile',
    )
  })
})
