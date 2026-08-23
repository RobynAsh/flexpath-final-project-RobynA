import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { AdminMilestoneDetails } from '../../../../services/milestones/types/milestoneTypes'
import type { ProjectSummary } from '../../../../services/projects/types/projectTypes'
import { AdminEditMilestone } from './AdminEditMilestone'

const mockUpdateMilestone = jest.fn()
const mockDeleteMilestones = {
  mutate: jest.fn(),
  isPending: false,
  isError: false,
}
const milestoneDetails: AdminMilestoneDetails = {
  projectName: 'Cardigan',
  username: 'froggy',
  milestone: {
    milestoneId: 7,
    projectId: 10,
    note: 'Finished the sleeves',
    rowCount: 24,
    repeatCount: 3,
    createdAt: '2025-01-01T12:00:00.000Z',
    updatedAt: '2025-01-02T12:00:00.000Z',
  },
}
const projects: ProjectSummary[] = [
  {
    project: {
      projectId: 10,
      username: 'froggy',
      patternId: 5,
      name: 'Cardigan',
      status: 'In Progress',
      public: true,
      care: null,
      gauge: null,
      dateStarted: null,
      dateFinished: null,
      dateNeededBy: null,
      createdAt: '2025-01-01T12:00:00.000Z',
      updatedAt: '2025-01-01T12:00:00.000Z',
    },
    tags: [],
  },
]

jest.mock(
  '../../../../services/milestones/admin/useAdminGetAllMilestones',
  () => ({
    useAdminGetAllMilestones: () => ({
      data: [milestoneDetails],
      isPending: false,
      isError: false,
    }),
  }),
)
jest.mock(
  '../../../../services/milestones/admin/useAdminUpdateMilestone',
  () => ({
    useAdminUpdateMilestone: () => ({ mutateAsync: mockUpdateMilestone }),
  }),
)
jest.mock(
  '../../../../services/milestones/admin/useAdminDeleteMilestones',
  () => ({ useAdminDeleteMilestones: () => mockDeleteMilestones }),
)
jest.mock('../../../../services/projects/admin/useAdminGetAllProjects', () => ({
  useAdminGetAllProjects: () => ({
    data: projects,
    isPending: false,
    isError: false,
  }),
}))

const renderPage = () =>
  render(
    <MemoryRouter
      initialEntries={['/admin/milestones/edit/7']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route
          path="/admin/milestones/edit/:milestoneId"
          element={<AdminEditMilestone />}
        />
        <Route path="/admin/milestones" element={<p>Manage Milestones</p>} />
      </Routes>
    </MemoryRouter>,
  )

describe('AdminEditMilestone', () => {
  beforeEach(() => {
    mockUpdateMilestone.mockReset().mockResolvedValue(undefined)
    mockDeleteMilestones.mutate.mockReset()
  })

  test('loads and updates the selected milestone', async () => {
    renderPage()

    expect(screen.getByLabelText('Project')).toHaveValue('10')
    expect(screen.getByLabelText('Note')).toHaveValue('Finished the sleeves')
    fireEvent.change(screen.getByLabelText('Note'), {
      target: { value: 'Finished the collar' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save Milestone' }))

    await waitFor(() =>
      expect(mockUpdateMilestone).toHaveBeenCalledWith({
        projectId: 10,
        note: 'Finished the collar',
        rowCount: 24,
        repeatCount: 3,
      }),
    )
    expect(await screen.findByText('Manage Milestones')).toBeInTheDocument()
  })

  test('deletes the current milestone after confirmation', async () => {
    mockDeleteMilestones.mutate.mockImplementation(
      (_ids, options: { onSuccess: () => void }) => options.onSuccess(),
    )
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Delete Milestone' }))
    expect(
      screen.getByText(
        'Are you sure you want to delete this milestone from Cardigan?',
      ),
    ).toBeInTheDocument()
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Delete Milestone' })[1],
    )

    expect(mockDeleteMilestones.mutate).toHaveBeenCalledWith(
      [7],
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )
    expect(await screen.findByText('Manage Milestones')).toBeInTheDocument()
  })
})
