import { fireEvent, render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  test('renders its content, type, variant, custom class, and click handler', () => {
    const onClick = jest.fn()

    render(
      <Button
        type="submit"
        variant="primary"
        className="justify-center"
        onClick={onClick}
      >
        Save
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveClass('bg-olive-500')
    expect(screen.getByText('Save')).toHaveClass('justify-center')

    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('uses secondary styling', () => {
    render(<Button variant="secondary">Cancel</Button>)

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass(
      'border-rose-200',
      'bg-transparent',
    )
  })
})
