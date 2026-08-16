import { useGetPatterns } from '../../../../services/patterns/useGetPatterns'
import { useAddProject } from '../../../../services/projects/useAddProject'
import { ProjectForm } from '../ProjectForm'

export const AddProject = () => {
  const { mutateAsync: addProject } = useAddProject()
  const { data: patterns, isPending, isError } = useGetPatterns()

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5 md:self-center">
      <div>
        <h1>Add Project</h1>
        <h4>Add a project to your Frog Log.</h4>
      </div>

      {isPending && <p>Loading patterns...</p>}
      {isError && (
        <p role="alert" className="text-rose-600">
          Unable to load your patterns.
        </p>
      )}
      {patterns && patterns.length === 0 && (
        <p>You need to add a pattern before you can create a project.</p>
      )}
      {patterns && patterns.length > 0 && (
        <ProjectForm
          patterns={patterns}
          onSubmit={addProject}
          successRedirectPath="/projects"
        />
      )}
    </div>
  )
}
