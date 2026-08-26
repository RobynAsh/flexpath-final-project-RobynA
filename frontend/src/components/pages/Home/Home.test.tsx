import { render, screen } from '@testing-library/react'
import { Home } from './Home'
import {
  ProfileContext,
  type ProfileContextValue,
} from '../../../providers/ProfileContext'
import { MemoryRouter } from 'react-router-dom'
import { useGetProjects } from '../../../services/projects/useGetProjects'

jest.mock('../../../services/projects/useGetProjects', () => ({
  useGetProjects: jest.fn(() => ({
    data: [
      { project: { projectId: 1, status: 'Not Started' }, tags: [] },
      { project: { projectId: 2, status: 'In Progress' }, tags: [] },
      { project: { projectId: 3, status: 'In Progress' }, tags: [] },
      { project: { projectId: 4, status: 'Completed' }, tags: [] },
    ],
  })),
}))

jest.mock('../../../services/milestones/useGetRecentMilestones', () => ({
  useGetRecentMilestones: () => ({
    data: [
      {
        projectName: 'Cozy Cardigan',
        milestone: {
          milestoneId: 3,
          projectId: 12,
          note: 'Finished the second sleeve',
          rowCount: 48,
          repeatCount: 0,
          createdAt: '2026-08-12T10:00:00',
          updatedAt: '2026-08-12T10:00:00',
        },
      },
      {
        projectName: 'Striped Scarf',
        milestone: {
          milestoneId: 2,
          projectId: 8,
          note: 'Changed to the contrast color',
          rowCount: 0,
          repeatCount: 6,
          createdAt: '2026-08-11T10:00:00',
          updatedAt: '2026-08-11T10:00:00',
        },
      },
      {
        projectName: 'Market Bag',
        milestone: {
          milestoneId: 1,
          projectId: 5,
          note: 'Completed the base',
          rowCount: 20,
          repeatCount: 2,
          createdAt: '2026-08-10T10:00:00',
          updatedAt: '2026-08-10T10:00:00',
        },
      },
    ],
    isLoading: false,
    isError: false,
  }),
}))

const setJwtToken = jest.fn()
export const profileValue: ProfileContextValue = {
  profileStatus: 'authenticated',
  jwtToken: '1234advdsf',
  setJwtToken,
}

describe('Home', () => {
  test('renders its page label', () => {
    render(
      <MemoryRouter
        initialEntries={['/']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ProfileContext.Provider value={profileValue}>
          <Home />
        </ProfileContext.Provider>
      </MemoryRouter>,
    )
    expect(screen.getByText('Welcome back,')).toBeInTheDocument()
    expect(useGetProjects).toHaveBeenCalledWith({ includePublic: false })
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getAllByText('1')).toHaveLength(2)
    expect(screen.getByText('Finished the second sleeve')).toBeInTheDocument()
    expect(screen.getByText('Rows: 48')).toBeInTheDocument()
    expect(screen.getByText('Repeats: 6')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Cozy Cardigan' })).toHaveAttribute(
      'href',
      '/projects/12',
    )
  })
})
