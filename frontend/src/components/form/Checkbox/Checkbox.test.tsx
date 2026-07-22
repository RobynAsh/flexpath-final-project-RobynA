import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  test('reports changes and reflects controlled state', () => {
    const Harness = () => {
      const [checked, setChecked] = useState(false)
      return (
        <Checkbox
          id="remember"
          label="Remember me"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
      )
    }

    render(<Harness />)
    const checkbox = screen.getByRole('checkbox', { name: 'Remember me' })
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })
})
