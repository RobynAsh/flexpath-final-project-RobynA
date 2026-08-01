import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminAddPattern } from './AdminAddPattern'

const mockAddPattern = jest.fn(async () => undefined)

jest.mock('../../../../services/useAddPattern', () => ({
  useAddPattern: () => ({ mutateAsync: mockAddPattern }),
}))

const renderAdminAddPattern = () =>
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AdminAddPattern />
    </MemoryRouter>,
  )

const addYarn = () => {
  fireEvent.change(screen.getByLabelText('Weight'), {
    target: { value: '4' },
  })
  fireEvent.change(screen.getByLabelText('Yardage'), {
    target: { value: '251' },
  })
  fireEvent.change(screen.getByLabelText('Grams'), {
    target: { value: '142' },
  })
  fireEvent.change(
    screen.getByLabelText('Description', {
      selector: '#yarn-description',
    }),
    { target: { value: 'Body' } },
  )

  fireEvent.click(screen.getByRole('button', { name: 'Add Yarn Requirement' }))
}

const completePatternFields = () => {
  const valuesByLabel = {
    Username: 'froggy',
    'Pattern Name': 'Cozy Cardigan',
    Designer: 'Robin',
    'Pattern URL': 'https://example.com/pattern',
    Category: 'Sweater',
    Technique: 'Crochet',
    Difficulty: 'Beginner',
  }

  Object.entries(valuesByLabel).forEach(([label, value]) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  })

  fireEvent.change(
    screen.getByLabelText('Description', { selector: '#description' }),
    { target: { value: 'A cozy cardigan.' } },
  )
}

beforeEach(() => {
  mockAddPattern.mockClear()
})

describe('AdminAddPattern yarn requirements', () => {
  test('validates yarn without validating the pattern fields', async () => {
    renderAdminAddPattern()

    fireEvent.click(
      screen.getByRole('button', { name: 'Add Yarn Requirement' }),
    )

    expect(await screen.findByText('Weight is required.')).toBeInTheDocument()
    expect(
      screen.queryByText('Pattern name is required.'),
    ).not.toBeInTheDocument()
  })

  test('adds yarn to the pattern request and displays and removes it', async () => {
    renderAdminAddPattern()
    addYarn()

    expect(await screen.findByText('Body')).toBeInTheDocument()
    expect(
      screen.getByText('Weight 4 · 251 yards · 142 grams'),
    ).toBeInTheDocument()

    completePatternFields()
    fireEvent.click(screen.getByRole('button', { name: 'Save Pattern' }))

    await waitFor(() =>
      expect(mockAddPattern).toHaveBeenCalledWith(
        expect.objectContaining({
          yarn: [
            {
              weight: 4,
              yardage: 251,
              grams: 142,
              description: 'Body',
            },
          ],
        }),
      ),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(screen.queryByText('Body')).not.toBeInTheDocument()
  })
})

describe('AdminAddPattern tool requirements', () => {
  test('validates tools without validating the pattern fields', async () => {
    renderAdminAddPattern()

    fireEvent.click(
      screen.getByRole('button', { name: 'Add Tool Requirement' }),
    )

    expect(
      await screen.findByText('Tool type is required.'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Pattern name is required.'),
    ).not.toBeInTheDocument()
  })

  test('adds tools to the pattern request and displays and removes them', async () => {
    renderAdminAddPattern()

    fireEvent.change(screen.getByLabelText('Tool Type'), {
      target: { value: 'Crochet hook' },
    })
    fireEvent.change(screen.getByLabelText('Size (mm)'), {
      target: { value: '5.5' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: 'Add Tool Requirement' }),
    )

    expect(await screen.findByText('Crochet hook')).toBeInTheDocument()
    expect(screen.getByText('5.5 mm')).toBeInTheDocument()

    completePatternFields()
    fireEvent.click(screen.getByRole('button', { name: 'Save Pattern' }))

    await waitFor(() =>
      expect(mockAddPattern).toHaveBeenCalledWith(
        expect.objectContaining({
          tools: [{ toolType: 'Crochet hook', sizeMm: 5.5 }],
        }),
      ),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(screen.queryByText('Crochet hook')).not.toBeInTheDocument()
  })
})
