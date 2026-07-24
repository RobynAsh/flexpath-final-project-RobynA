import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { TextArea } from './TextArea'

describe('TextArea', () => {
  test('associates its label, forwards textarea props and ref', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(
      <TextArea
        ref={ref}
        id="description"
        label="Description"
        placeholder="Describe the pattern"
        maxLength={1000}
      />,
    )

    const textArea = screen.getByLabelText('Description')
    expect(textArea).toHaveAttribute('placeholder', 'Describe the pattern')
    expect(textArea).toHaveAttribute('maxlength', '1000')
    expect(ref.current).toBe(textArea)
  })

  test('displays an error and error styling', () => {
    render(
      <TextArea
        id="description"
        label="Description"
        error="Description is required."
      />,
    )

    expect(screen.getByText('Description is required.')).toBeInTheDocument()
    expect(screen.getByText('Description')).toHaveClass('text-rose-500')
  })
})
