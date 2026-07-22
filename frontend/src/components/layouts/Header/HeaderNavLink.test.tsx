import { fireEvent, render, screen } from '@testing-library/react'
import { HeaderNavLink } from './HeaderNavLink'

describe('HeaderNavLink', () => {
  test('renders content and handles clicks', () => {
    const onClick = jest.fn()
    render(<HeaderNavLink onClick={onClick}>Profile</HeaderNavLink>)

    fireEvent.click(screen.getByText('Profile'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
