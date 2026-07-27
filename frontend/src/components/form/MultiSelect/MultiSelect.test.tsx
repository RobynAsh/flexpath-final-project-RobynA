import { fireEvent, render, screen } from '@testing-library/react'
import { MultiSelect } from './MultiSelect'

describe('MultiSelect', () => {
  test('adds trimmed text when Enter is pressed', () => {
    const onChange = jest.fn()
    render(
      <MultiSelect
        id="tags"
        label="Tags"
        value={['cozy']}
        onChange={onChange}
        placeholder="Add a tag"
      />,
    )

    const input = screen.getByLabelText('Tags')
    fireEvent.change(input, { target: { value: '  Winter  ' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onChange).toHaveBeenCalledWith(['cozy', 'winter'])
    expect(input).toHaveValue('')
  })

  test('does not add empty or duplicate values', () => {
    const onChange = jest.fn()
    render(
      <MultiSelect
        id="tags"
        label="Tags"
        value={['cozy']}
        onChange={onChange}
      />,
    )

    const input = screen.getByLabelText('Tags')
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.change(input, { target: { value: 'Cozy' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onChange).not.toHaveBeenCalled()
    expect(input).toHaveValue('')
  })

  test('removes a selected value', () => {
    const onChange = jest.fn()
    render(
      <MultiSelect
        id="tags"
        label="Tags"
        value={['cozy', 'winter']}
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remove Cozy' }))

    expect(onChange).toHaveBeenCalledWith(['winter'])
  })
})
