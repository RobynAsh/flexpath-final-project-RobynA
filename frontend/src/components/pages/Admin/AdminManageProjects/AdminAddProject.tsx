import { useAdminGetAllPatterns } from '../../../../services/patterns/admin/useAdminGetAllPatterns'
import { useAdminAddProject } from '../../../../services/projects/admin/useAdminAddProject'
import { ProjectForm } from '../../Projects/ProjectForm'

export const AdminAddProject = () => {
  const { mutateAsync: addProject } = useAdminAddProject()
  const { data: patterns, isPending, isError } = useAdminGetAllPatterns()

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5 md:self-center">
      <div>
        <h1>Add Project</h1>
        <h4>Add a project to the Frog Log catalog.</h4>
      </div>

      {isPending && <p role="status">Loading patterns...</p>}
      {isError && (
        <p role="alert" className="text-rose-600">
          Unable to load patterns.
        </p>
      )}
      {patterns && patterns.length === 0 && (
        <p>You need to add a pattern before you can create a project.</p>
      )}
      {patterns && patterns.length > 0 && (
        <ProjectForm
          includeUsername
          patterns={patterns}
          onSubmit={addProject}
          successRedirectPath="/admin/projects"
        />
      )}
    </div>
  )
}
