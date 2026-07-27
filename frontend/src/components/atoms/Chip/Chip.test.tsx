import { fireEvent, render, screen } from '@testing-library/react'
import { Chip } from './Chip'

describe('Chip', () => {
  test('displays its label and invokes its remove handler', () => {
    const onRemove = jest.fn()
    render(<Chip label="cozy" onRemove={onRemove} />)

    expect(screen.getByText('cozy')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Remove Cozy' }))

    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  test('does not render a remove button without a remove handler', () => {
    render(<Chip label="cozy" />)

    expect(screen.getByText('cozy')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
