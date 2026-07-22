import { render, screen } from '@testing-library/react'
import { PreLoginLayout } from './PreLoginLayout'

describe('PreLoginLayout', () => {
  test('renders its title, subtitle, artwork, and children', () => {
    render(
      <PreLoginLayout title="Welcome" subtitle="Join the community">
        <p>Form content</p>
      </PreLoginLayout>,
    )

    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument()
    expect(screen.getByText('Join the community')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Hero Polaroid' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Form content')).toBeInTheDocument()
  })
})
