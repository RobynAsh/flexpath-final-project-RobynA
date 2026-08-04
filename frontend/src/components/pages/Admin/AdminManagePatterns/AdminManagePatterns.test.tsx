import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { PatternDetails } from '../../../../services/useGetAllPatterns'
import { AdminManagePatterns } from './AdminManagePatterns'

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
      link: null,
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
      link: null,
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

jest.mock('../../../../services/useGetAllPatterns', () => ({
  useGetAllPatterns: () => ({
    data: patterns,
    isPending: false,
    isError: false,
  }),
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

describe('AdminManagePatterns sorting and filtering', () => {
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
})
