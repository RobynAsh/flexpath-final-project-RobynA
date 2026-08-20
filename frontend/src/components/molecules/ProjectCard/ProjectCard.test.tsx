import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import {
  ProfileContext,
  type ProfileContextValue,
} from '../../../providers/ProfileContext'
import type { ProjectSummary } from '../../../services/projects/types/projectTypes'
import { ProjectCard } from './ProjectCard'

const details: ProjectSummary = {
  project: {
    projectId: 1,
    username: 'project-owner',
    patternId: 1,
    name: 'Public cardigan',
    status: 'In Progress',
    public: true,
    care: null,
    gauge: null,
    dateStarted: null,
    dateFinished: null,
    dateNeededBy: null,
    createdAt: '2026-08-01T10:00:00',
    updatedAt: '2026-08-01T10:00:00',
  },
  tags: [],
}

const renderCard = (username: string) => {
  const profile: ProfileContextValue = {
    profile: { username, isAdmin: false },
    profileStatus: 'authenticated',
    jwtToken: 'token',
    setJwtToken: jest.fn(),
  }

  return render(
    <ProfileContext.Provider value={profile}>
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ProjectCard details={details} />
      </MemoryRouter>
    </ProfileContext.Provider>,
  )
}

test('shows the project owner and hides editing from a non-owner', () => {
  renderCard('viewer')

  expect(screen.getByText('Owned by project-owner')).toBeVisible()
  expect(
    screen.queryByRole('link', { name: 'Edit Public cardigan' }),
  ).not.toBeInTheDocument()
})

test('allows the project owner to edit from the card', () => {
  renderCard('project-owner')

  expect(
    screen.getByRole('link', { name: 'Edit Public cardigan' }),
  ).toHaveAttribute('href', '/projects/1/update')
})
