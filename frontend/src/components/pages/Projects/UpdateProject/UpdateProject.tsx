import { Link, useParams } from 'react-router-dom'
import { useGetPatterns } from '../../../../services/patterns/useGetPatterns'
import type { AddProjectRequest } from '../../../../services/projects/types/projectFormTypes'
import { useGetProject } from '../../../../services/projects/useGetProject'
import { useUpdateProject } from '../../../../services/projects/useUpdateProject'
import { ProjectForm } from '../ProjectForm'

export const UpdateProject = () => {
  const { projectId: projectIdParam } = useParams()
  const projectId = Number(projectIdParam)
  const {
    data: projectDetails,
    isPending: isProjectPending,
    isError: isProjectError,
  } = useGetProject(projectId)

  const {
    data: patterns,
    isPending: arePatternsPending,
    isError: arePatternsError,
  } = useGetPatterns()
  const { mutateAsync: updateProject } = useUpdateProject(projectId)

  if (isProjectPending || arePatternsPending) {
    return <p role="status">Loading project...</p>
  }

  if (
    !Number.isInteger(projectId) ||
    projectId <= 0 ||
    isProjectError ||
    arePatternsError ||
    !projectDetails ||
    !patterns
  ) {
    return (
      <div className="flex flex-col gap-3">
        <p>Unable to load the project. It may not exist.</p>
        <Link className="text-olive-600 underline" to="/projects">
          Return to Projects
        </Link>
      </div>
    )
  }

  const { project, tags } = projectDetails
  const initialValues: AddProjectRequest = {
    patternId: project.patternId,
    name: project.name,
    status: project.status,
    isPublic: project.public,
    care: project.care ?? '',
    gauge: project.gauge ?? '',
    tags: tags.map((tag) => tag.name),
    dateStarted: project.dateStarted ?? '',
    dateFinished: project.dateFinished ?? '',
    dateNeededBy: project.dateNeededBy ?? '',
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5 md:self-center">
      <div>
        <h1>Update Project</h1>
        <h4>Update a project in your Frog Log.</h4>
      </div>

      <ProjectForm
        patterns={patterns}
        initialValues={initialValues}
        onSubmit={updateProject}
        successRedirectPath={`/projects/${projectId}`}
      />
    </div>
  )
}
