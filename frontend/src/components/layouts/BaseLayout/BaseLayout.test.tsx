import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProfileContext } from '../../../providers/ProfileContext'
import { BaseLayout } from './BaseLayout'

describe('BaseLayout', () => {
  test('composes header, content container, and footer', () => {
    const { container } = render(
      <ProfileContext.Provider
        value={{
          profileStatus: 'unauthenticated',
          jwtToken: '',
          setJwtToken: jest.fn(),
        }}
      >
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <BaseLayout containerClassName="page-content">Page body</BaseLayout>
        </MemoryRouter>
      </ProfileContext.Provider>,
    )

    expect(screen.getByText('Page body')).toHaveClass('page-content')
    expect(container.querySelector('.footer')).toBeInTheDocument()
  })
})
