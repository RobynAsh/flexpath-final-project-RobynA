import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { PatternDetails } from '../../../services/patterns/types/patternTypes'
import type { AddProjectRequest } from '../../../services/projects/types/projectFormTypes'
import { ProjectForm } from './ProjectForm'

const patterns: PatternDetails[] = [
  {
    pattern: {
      patternId: 12,
      username: 'robin',
      category: 'Sweater',
      technique: 'Crochet',
      name: 'Cozy Cardigan',
      designer: 'Robin',
      description: null,
      difficulty: 'Beginner',
      link: 'https://example.com/pattern',
      imageUrl: null,
      createdAt: '2026-08-11T12:00:00',
      updatedAt: '2026-08-11T12:00:00',
    },
    tags: [],
    yarn: [],
    tools: [],
    materials: [],
  },
]

const validProject: AddProjectRequest = {
  username: '',
  patternId: 12,
  name: 'Birthday Cardigan',
  status: 'In Progress',
  isPublic: true,
  care: 'Hand wash and lay flat to dry.',
  gauge: '18 stitches per 4 inches',
  tags: ['gift', 'cardigan'],
  dateStarted: '2026-08-01',
  dateFinished: '',
  dateNeededBy: '2026-09-01',
}

describe('ProjectForm', () => {
  test('submits the project and redirects after a successful save', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    render(
      <MemoryRouter
        initialEntries={['/form']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            path="/form"
            element={
              <ProjectForm
                patterns={patterns}
                initialValues={validProject}
                onSubmit={onSubmit}
                successRedirectPath="/projects"
              />
            }
          />
          <Route path="/projects" element={<p>My Projects</p>} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save Project' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(validProject))
    expect(await screen.findByText('My Projects')).toBeInTheDocument()
  })

  test('requires a project name and pattern', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    render(
      <MemoryRouter>
        <ProjectForm
          patterns={patterns}
          onSubmit={onSubmit}
          successRedirectPath="/projects"
        />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save Project' }))

    expect(await screen.findByText('Project name is required.')).toBeVisible()
    expect(screen.getByText('Pattern is required.')).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test('requires a username and matching pattern for admin forms', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    render(
      <MemoryRouter>
        <ProjectForm
          includeUsername
          patterns={patterns}
          onSubmit={onSubmit}
          successRedirectPath="/admin/projects"
        />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('Project Name'), {
      target: { value: 'Admin Project' },
    })
    fireEvent.change(screen.getByLabelText('Pattern'), {
      target: { value: '12' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save Project' }))

    expect(await screen.findByText('Username is required.')).toBeVisible()
    expect(
      screen.getByText('Select a pattern owned by this user.'),
    ).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
