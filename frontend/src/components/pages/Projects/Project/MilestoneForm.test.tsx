import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MilestoneForm } from './MilestoneForm'

describe('MilestoneForm', () => {
  test('submits a note with optional progress counts and clears the form', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    render(<MilestoneForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Note'), {
      target: { value: ' Finished the first sleeve ' },
    })
    fireEvent.change(screen.getByLabelText('Row Count'), {
      target: { value: '42' },
    })
    fireEvent.change(screen.getByLabelText('Repeat Count'), {
      target: { value: '3' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add Milestone' }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        note: 'Finished the first sleeve',
        rowCount: 42,
        repeatCount: 3,
      }),
    )
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Milestone added.',
    )
    expect(screen.getByLabelText('Note')).toHaveValue('')
  })

  test('requires a note and treats blank counts as zero', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    const { rerender } = render(<MilestoneForm onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add Milestone' }))
    expect(await screen.findByText('Milestone note is required.')).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()

    rerender(<MilestoneForm onSubmit={onSubmit} />)
    fireEvent.change(screen.getByLabelText('Note'), {
      target: { value: 'Started the body' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add Milestone' }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        note: 'Started the body',
        rowCount: 0,
        repeatCount: 0,
      }),
    )
  })
})
