import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AddPattern } from './AddPattern'

jest.mock('../../../../services/patterns/useAddPattern', () => ({
  useAddPattern: () => ({ mutateAsync: jest.fn() }),
}))

describe('AddPattern', () => {
  test('renders the reusable form without a username field', () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AddPattern />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Add Pattern' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Pattern Name')).toBeInTheDocument()
    expect(screen.queryByLabelText('Username')).not.toBeInTheDocument()
  })
})
