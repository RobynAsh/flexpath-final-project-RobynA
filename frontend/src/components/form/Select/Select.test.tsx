import { fireEvent, render, screen } from '@testing-library/react'
import { Select } from './Select'

describe('Select', () => {
  it('renders its options and reports value changes', () => {
    const onChange = jest.fn()

    render(
      <Select
        id="pattern-field"
        label="Pattern Field"
        options={[
          { value: 'name', label: 'Name' },
          { value: 'designer', label: 'Designer' },
        ]}
        value="name"
        onChange={(event) => onChange(event.target.value)}
      />,
    )

    const select = screen.getByRole('combobox', { name: 'Pattern Field' })

    expect(screen.getAllByRole('option')).toHaveLength(2)
    fireEvent.change(select, { target: { value: 'designer' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('designer')
  })
})
