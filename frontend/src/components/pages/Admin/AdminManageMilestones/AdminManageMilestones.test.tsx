import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { AdminMilestoneDetails } from '../../../../services/milestones/types/milestoneTypes'
import { AdminManageMilestones } from './AdminManageMilestones'

const mockDeleteMilestones = {
  mutate: jest.fn(),
  isPending: false,
  isError: false,
}

const milestones: AdminMilestoneDetails[] = [
  {
    projectName: 'Cardigan',
    username: 'froggy',
    milestone: {
      milestoneId: 1,
      projectId: 10,
      note: 'Finished the sleeves',
      rowCount: 24,
      repeatCount: 3,
      createdAt: '2025-01-01T12:00:00.000Z',
      updatedAt: '2025-01-02T12:00:00.000Z',
    },
  },
  {
    projectName: 'Acorn Hat',
    username: 'toadstool',
    milestone: {
      milestoneId: 2,
      projectId: 20,
      note: 'Completed the brim',
      rowCount: 12,
      repeatCount: 1,
      createdAt: '2025-02-01T12:00:00.000Z',
      updatedAt: '2025-02-02T12:00:00.000Z',
    },
  },
]

const mockGetAllAdminMilestones = jest.fn((_options: unknown) => ({
  data: milestones,
  isPending: false,
  isError: false,
}))

jest.mock(
  '../../../../services/milestones/admin/useAdminGetAllMilestones',
  () => ({
    useAdminGetAllMilestones: (options: unknown) =>
      mockGetAllAdminMilestones(options),
  }),
)

jest.mock(
  '../../../../services/milestones/admin/useAdminDeleteMilestones',
  () => ({ useAdminDeleteMilestones: () => mockDeleteMilestones }),
)

const renderPage = () =>
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AdminManageMilestones />
    </MemoryRouter>,
  )

const listedProjects = () =>
  screen
    .getAllByRole('article')
    .map((card) => within(card).getByRole('heading', { level: 3 }).textContent)

describe('AdminManageMilestones', () => {
  beforeEach(() => {
    mockGetAllAdminMilestones.mockClear()
    mockDeleteMilestones.mutate.mockReset()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('links milestones to edit and requests the selected sorting', () => {
    renderPage()

    expect(
      screen.getByRole('link', { name: 'Edit milestone 2' }),
    ).toHaveAttribute('href', '/admin/milestones/edit/2')
    expect(listedProjects()).toEqual(['Cardigan', 'Acorn Hat'])

    fireEvent.change(screen.getByLabelText('Sort By'), {
      target: { value: 'rowCount' },
    })
    fireEvent.click(screen.getByLabelText('Ascending'))

    expect(mockGetAllAdminMilestones).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sortField: 'rowCount',
        sortDirection: 'ascending',
      }),
    )
  })

  test('debounces filtering before requesting matching milestones', () => {
    jest.useFakeTimers()
    renderPage()

    fireEvent.change(screen.getByLabelText('Filter By'), {
      target: { value: 'note' },
    })
    fireEvent.change(screen.getByLabelText('Search Text'), {
      target: { value: 'SLEEVES' },
    })

    expect(mockGetAllAdminMilestones).toHaveBeenLastCalledWith(
      expect.objectContaining({ filterField: 'note', filterText: '' }),
    )

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(mockGetAllAdminMilestones).toHaveBeenLastCalledWith(
      expect.objectContaining({ filterField: 'note', filterText: 'SLEEVES' }),
    )
  })

  test('bulk deletes selected milestones after confirmation', () => {
    renderPage()

    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Select milestone 1' }),
    )
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Select milestone 2' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Delete 2 Milestones' }))

    const modal = screen.getByRole('heading', {
      name: 'Delete Milestones?',
    }).parentElement
    expect(modal).not.toBeNull()
    expect(within(modal!).getByText(/Finished the sleeves/)).toBeInTheDocument()
    expect(within(modal!).getByText(/Completed the brim/)).toBeInTheDocument()

    fireEvent.click(
      within(modal!).getByRole('button', { name: 'Delete Milestones' }),
    )
    expect(mockDeleteMilestones.mutate).toHaveBeenCalledWith(
      expect.arrayContaining([1, 2]),
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )
  })
})
