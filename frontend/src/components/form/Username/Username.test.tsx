import { render, screen } from '@testing-library/react'
import { Username } from './Username'

describe('Username', () => {
  test('supplies its standard label, id, and placeholder', () => {
    render(<Username name="username" />)

    expect(screen.getByLabelText('Username')).toHaveAttribute('id', 'username')
    expect(screen.getByLabelText('Username')).toHaveAttribute(
      'placeholder',
      'Enter your username',
    )
  })
})
