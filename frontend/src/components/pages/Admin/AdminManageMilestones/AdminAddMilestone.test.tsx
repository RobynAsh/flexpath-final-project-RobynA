import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { ProjectSummary } from '../../../../services/projects/types/projectTypes'
import { AdminAddMilestone } from './AdminAddMilestone'

const mockAddMilestone = jest.fn()
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

jest.mock('../../../../services/milestones/admin/useAdminAddMilestone', () => ({
  useAdminAddMilestone: () => ({ mutateAsync: mockAddMilestone }),
}))
jest.mock('../../../../services/projects/admin/useAdminGetAllProjects', () => ({
  useAdminGetAllProjects: () => ({
    data: projects,
    isPending: false,
    isError: false,
  }),
}))

describe('AdminAddMilestone', () => {
  test('adds a milestone for the selected project and returns to manage', async () => {
    mockAddMilestone.mockResolvedValue(undefined)
    render(
      <MemoryRouter
        initialEntries={['/admin/milestones/add']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/admin/milestones/add" element={<AdminAddMilestone />} />
          <Route path="/admin/milestones" element={<p>Manage Milestones</p>} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('Project'), {
      target: { value: '10' },
    })
    fireEvent.change(screen.getByLabelText('Row Count'), {
      target: { value: '24' },
    })
    fireEvent.change(screen.getByLabelText('Repeat Count'), {
      target: { value: '3' },
    })
    fireEvent.change(screen.getByLabelText('Note'), {
      target: { value: '  Finished the sleeves  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save Milestone' }))

    await waitFor(() =>
      expect(mockAddMilestone).toHaveBeenCalledWith({
        projectId: 10,
        note: 'Finished the sleeves',
        rowCount: 24,
        repeatCount: 3,
      }),
    )
    expect(await screen.findByText('Manage Milestones')).toBeInTheDocument()
  })
})
