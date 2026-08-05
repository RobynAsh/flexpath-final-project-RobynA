import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { PatternDetails } from '../../../../services/useGetAllPatterns'
import { AdminEditPattern } from './AdminEditPattern'

const mockUpdatePattern = jest.fn()

const patternDetails: PatternDetails = {
  pattern: {
    patternId: 42,
    username: 'froggy',
    category: 'Sweater',
    technique: 'Crochet',
    name: 'Zigzag Cardigan',
    designer: 'Robin',
    description: 'A warm layer',
    difficulty: 'Intermediate',
    link: 'https://example.com/pattern',
    imageUrl: 'https://example.com/image.jpg',
    createdAt: '2025-01-01T12:00:00.000Z',
    updatedAt: '2025-03-01T12:00:00.000Z',
  },
  tags: [{ tagId: 1, username: 'froggy', name: 'cozy' }],
  yarn: [
    {
      patternYarnId: 1,
      patternId: 42,
      suggestedYarnId: null,
      description: 'Body',
      weight: 4,
      yardage: 251,
      grams: 142,
    },
  ],
  tools: [
    {
      patternToolId: 1,
      patternId: 42,
      toolType: 'Crochet hook',
      sizeMm: 5.5,
    },
  ],
  materials: [
    {
      patternMaterialId: 1,
      patternId: 42,
      name: 'Buttons',
      description: 'Wooden',
      quantity: 6,
      createdAt: '2025-01-01T12:00:00.000Z',
      updatedAt: '2025-01-01T12:00:00.000Z',
    },
  ],
}

jest.mock('../../../../services/useGetAllPatterns', () => ({
  useGetAllPatterns: () => ({
    data: [patternDetails],
    isPending: false,
    isError: false,
  }),
}))

jest.mock('../../../../services/useUpdatePattern', () => ({
  useUpdatePattern: () => ({ mutateAsync: mockUpdatePattern }),
}))

const renderPage = () =>
  render(
    <MemoryRouter
      initialEntries={['/admin/patterns/edit/42']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route
          path="/admin/patterns/edit/:patternId"
          element={<AdminEditPattern />}
        />
        <Route path="/admin/patterns" element={<p>Manage Patterns</p>} />
      </Routes>
    </MemoryRouter>,
  )

describe('AdminEditPattern', () => {
  beforeEach(() => {
    mockUpdatePattern.mockReset()
    mockUpdatePattern.mockResolvedValue(undefined)
  })

  test('loads the selected pattern into the same form fields and requirements', () => {
    renderPage()

    expect(screen.getByLabelText('Username')).toHaveValue('froggy')
    expect(screen.getByLabelText('Pattern Name')).toHaveValue('Zigzag Cardigan')
    expect(screen.getByLabelText('Designer')).toHaveValue('Robin')
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByText('Crochet hook')).toBeInTheDocument()
    expect(screen.getByText('Buttons')).toBeInTheDocument()
  })

  test('updates the selected pattern and returns to the patterns page', async () => {
    renderPage()

    fireEvent.change(screen.getByLabelText('Pattern Name'), {
      target: { value: 'Updated Cardigan' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save Pattern' }))

    await waitFor(() =>
      expect(mockUpdatePattern).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Cardigan',
          tags: ['cozy'],
          yarn: [
            {
              description: 'Body',
              weight: 4,
              yardage: 251,
              grams: 142,
            },
          ],
        }),
      ),
    )
    expect(await screen.findByText('Manage Patterns')).toBeInTheDocument()
  })
})
