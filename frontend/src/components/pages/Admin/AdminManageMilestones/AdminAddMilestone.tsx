import { useAdminAddMilestone } from '../../../../services/milestones/admin/useAdminAddMilestone'
import { useAdminGetAllProjects } from '../../../../services/projects/admin/useAdminGetAllProjects'
import { AdminMilestoneForm } from './AdminMilestoneForm'

export const AdminAddMilestone = () => {
  const { mutateAsync: addMilestone } = useAdminAddMilestone()
  const { data: projects, isPending, isError } = useAdminGetAllProjects()

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5 md:self-center">
      <div>
        <h1>Add Milestone</h1>
        <h4>Add a milestone to a project in the Frog Log catalog.</h4>
      </div>

      {isPending && <p role="status">Loading projects...</p>}
      {isError && (
        <p role="alert" className="text-rose-600">
          Unable to load projects.
        </p>
      )}
      {projects && projects.length === 0 && (
        <p>You need to add a project before you can create a milestone.</p>
      )}
      {projects && projects.length > 0 && (
        <AdminMilestoneForm
          projects={projects}
          onSubmit={addMilestone}
          successRedirectPath="/admin/milestones"
        />
      )}
    </div>
  )
}
