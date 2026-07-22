import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { TextField } from './TextField'

describe('TextField', () => {
  test('associates its label, forwards input props and ref', () => {
    const ref = createRef<HTMLInputElement>()
    render(
      <TextField
        ref={ref}
        id="email"
        label="Email"
        placeholder="name@example.com"
        leftIcon={faUser}
      />,
    )

    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('placeholder', 'name@example.com')
    expect(ref.current).toBe(input)
  })

  test('displays an error and error styling', () => {
    render(<TextField id="email" label="Email" error="Email is required." />)

    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Email')).toHaveClass('text-rose-500')
  })

  test('invokes a right-icon click handler', () => {
    const onClick = jest.fn()
    const { container } = render(
      <TextField
        id="search"
        label="Search"
        rightIcon={faUser}
        rightIconOnClick={onClick}
      />,
    )

    fireEvent.click(container.querySelector('svg')!.parentElement!)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
