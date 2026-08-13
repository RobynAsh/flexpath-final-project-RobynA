import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { PatternDetails } from '../../../../services/patterns/admin/useAdminGetAllPatterns'
import { AdminManagePatterns } from './AdminManagePatterns'

const mockDeletePatterns = {
  mutate: jest.fn(),
  reset: jest.fn(),
  isPending: false,
  isError: false,
}

const patterns: PatternDetails[] = [
  {
    pattern: {
      patternId: 1,
      username: 'froggy',
      category: 'Sweater',
      technique: 'Crochet',
      name: 'Zigzag Cardigan',
      designer: 'Robin',
      description: 'A warm layer',
      difficulty: 'Intermediate',
      link: 'https://www.example.com/zigzag-cardigan',
      imageUrl: null,
      createdAt: '2025-01-01T12:00:00.000Z',
      updatedAt: '2025-03-01T12:00:00.000Z',
    },
    tags: [],
    yarn: [],
    tools: [],
    materials: [],
  },
  {
    pattern: {
      patternId: 2,
      username: 'toadstool',
      category: 'Accessory',
      technique: 'Knitting',
      name: 'Acorn Hat',
      designer: 'Fern',
      description: 'A quick hat',
      difficulty: 'Beginner',
      link: 'https://www.example.com/acorn-hat',
      imageUrl: null,
      createdAt: '2025-02-01T12:00:00.000Z',
      updatedAt: '2025-02-15T12:00:00.000Z',
    },
    tags: [],
    yarn: [],
    tools: [],
    materials: [],
  },
]

jest.mock('../../../../services/patterns/admin/useAdminGetAllPatterns', () => ({
  useAdminGetAllPatterns: () => ({
    data: patterns,
    isPending: false,
    isError: false,
  }),
}))

jest.mock('../../../../services/patterns/admin/useAdminDeletePatterns', () => ({
  useAdminDeletePatterns: () => mockDeletePatterns,
}))

const renderPage = () =>
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AdminManagePatterns />
    </MemoryRouter>,
  )

const listedPatternNames = () =>
  screen
    .getAllByRole('article')
    .map((card) => within(card).getByRole('heading', { level: 3 }).textContent)

const patternCheckbox = (patternName: string) => {
  const heading = screen.getByRole('heading', { level: 3, name: patternName })
  const card = heading.closest('article')

  if (!card) {
    throw new Error(`Unable to find the pattern card for ${patternName}.`)
  }

  return within(card).getByRole('checkbox')
}

describe('AdminManagePatterns sorting and filtering', () => {
  beforeEach(() => {
    mockDeletePatterns.mutate.mockClear()
    mockDeletePatterns.reset.mockClear()
    mockDeletePatterns.isPending = false
    mockDeletePatterns.isError = false
  })

  test('links each pattern card to its edit route', () => {
    renderPage()

    expect(
      screen.getByRole('link', { name: 'Edit Acorn Hat' }),
    ).toHaveAttribute('href', '/admin/patterns/edit/2')
    expect(
      screen.getByRole('link', { name: 'Edit Zigzag Cardigan' }),
    ).toHaveAttribute('href', '/admin/patterns/edit/1')
  })

  test('sorts by the selected field and direction', () => {
    renderPage()

    expect(listedPatternNames()).toEqual(['Acorn Hat', 'Zigzag Cardigan'])

    fireEvent.change(screen.getByLabelText('Sort By'), {
      target: { value: 'createdAt' },
    })
    fireEvent.click(screen.getByLabelText('Descending'))

    expect(listedPatternNames()).toEqual(['Acorn Hat', 'Zigzag Cardigan'])

    fireEvent.change(screen.getByLabelText('Sort By'), {
      target: { value: 'updatedAt' },
    })

    expect(listedPatternNames()).toEqual(['Zigzag Cardigan', 'Acorn Hat'])
  })

  test('filters the list by the selected field without regard to case', () => {
    renderPage()

    fireEvent.change(screen.getByLabelText('Filter By'), {
      target: { value: 'technique' },
    })
    fireEvent.change(screen.getByLabelText('Search Text'), {
      target: { value: 'knit' },
    })

    expect(listedPatternNames()).toEqual(['Acorn Hat'])

    fireEvent.change(screen.getByLabelText('Search Text'), {
      target: { value: 'sewing' },
    })

    expect(screen.queryAllByRole('article')).toHaveLength(0)
    expect(
      screen.getByText('No patterns match your search.'),
    ).toBeInTheDocument()
  })

  test('enables bulk deletion when a pattern is selected', () => {
    renderPage()

    const deleteButton = screen.getByRole('button', {
      name: 'Delete Patterns',
    })
    expect(deleteButton).toBeDisabled()

    fireEvent.click(patternCheckbox('Acorn Hat'))

    expect(deleteButton).toBeEnabled()
  })

  test('keeps selections when filtering and sorting the list', () => {
    renderPage()

    fireEvent.click(patternCheckbox('Zigzag Cardigan'))
    fireEvent.change(screen.getByLabelText('Search Text'), {
      target: { value: 'acorn' },
    })
    fireEvent.change(screen.getByLabelText('Sort By'), {
      target: { value: 'updatedAt' },
    })
    fireEvent.change(screen.getByLabelText('Search Text'), {
      target: { value: '' },
    })

    expect(patternCheckbox('Zigzag Cardigan')).toBeChecked()
  })

  test('confirms the selected pattern names before deleting', () => {
    renderPage()

    fireEvent.click(patternCheckbox('Acorn Hat'))
    fireEvent.click(patternCheckbox('Zigzag Cardigan'))
    fireEvent.click(screen.getByRole('button', { name: 'Delete 2 Patterns' }))

    const modal = screen.getByRole('heading', {
      name: 'Delete Patterns?',
    }).parentElement

    expect(modal).not.toBeNull()
    expect(within(modal!).getByText('Acorn Hat')).toBeInTheDocument()
    expect(within(modal!).getByText('Zigzag Cardigan')).toBeInTheDocument()

    fireEvent.click(
      within(modal!).getByRole('button', { name: 'Delete Patterns' }),
    )
    expect(mockDeletePatterns.mutate).toHaveBeenCalledWith(
      expect.arrayContaining([1, 2]),
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )
  })
})
