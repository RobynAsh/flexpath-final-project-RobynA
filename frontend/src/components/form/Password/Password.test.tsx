import { fireEvent, render, screen } from '@testing-library/react'
import { Password } from './Password'

describe('Password', () => {
  test('toggles between hidden and visible text', () => {
    const { container } = render(<Password id="password" label="Password" />)
    const input = screen.getByLabelText('Password')

    expect(input).toHaveAttribute('type', 'password')
    fireEvent.click(
      container.querySelector('svg[data-icon="eye"]')!.parentElement!,
    )
    expect(input).toHaveAttribute('type', 'text')
    fireEvent.click(
      container.querySelector('svg[data-icon="eye-slash"]')!.parentElement!,
    )
    expect(input).toHaveAttribute('type', 'password')
  })
})
