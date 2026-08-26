import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useProfile } from '../../../providers/ProfileContext'
import { Button } from '../../atoms/Button/Button'
import { DashBorder } from '../../atoms/DashBorder/DashBorder'
import { DashedCard } from '../../atoms/DashedCard/DashedCard'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useGetProjects } from '../../../services/projects/useGetProjects'
import { useGetRecentMilestones } from '../../../services/milestones/useGetRecentMilestones'

const formatDateTime = (value: string) => new Date(value).toLocaleString()

export const Home = () => {
  const { profile } = useProfile()
  const { data: projects } = useGetProjects({ includePublic: false })
  const {
    data: recentMilestones,
    isLoading: areMilestonesLoading,
    isError: areMilestonesError,
  } = useGetRecentMilestones()

  const projectCounts = {
    total: projects?.length ?? 0,
    notStarted:
      projects?.filter(({ project }) => project.status === 'Not Started')
        .length ?? 0,
    inProgress:
      projects?.filter(({ project }) => project.status === 'In Progress')
        .length ?? 0,
    completed:
      projects?.filter(({ project }) => project.status === 'Completed')
        .length ?? 0,
  }

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex flex-col gap-1">
        <h1>Welcome back, {profile?.username}</h1>
        <DashBorder>
          <img
            src="/assets/heart-doodle.png"
            alt="Heart Doodle"
            className="h-5 w-5"
          />
        </DashBorder>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div>
          <DashedCard
            background="bg-paper-300"
            borderColor="border-thread-300"
            className="grow"
          >
            <h3 className="border-thread-300 mb-2 border-b pb-1">Quick Add</h3>
            <div className="grid grid-cols-1 gap-2">
              <Link to="/patterns/add">
                <Button variant="primary">
                  <FontAwesomeIcon icon={faPlus} />
                  Add Pattern
                </Button>
              </Link>
              <Link to="/projects/add">
                <Button variant="primary">
                  <FontAwesomeIcon icon={faPlus} />
                  Add Project
                </Button>
              </Link>
            </div>
          </DashedCard>
        </div>

        <DashedCard className="grow">
          <h3 className="border-paper-300 mb-2 border-b pb-1">At a Glance</h3>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
            <DashedCard
              className="w-full text-center"
              background="bg-honey-100"
              borderColor="border-honey-200"
            >
              <p className="text-2xl font-bold">{projectCounts.total}</p>
              <p className="text-lg">Projects Total</p>
            </DashedCard>
            <DashedCard
              className="w-full text-center"
              background="bg-grey-100"
              borderColor="border-grey-200"
            >
              <p className="text-2xl font-bold">{projectCounts.notStarted}</p>
              <p className="text-lg">Todo</p>
            </DashedCard>
            <DashedCard
              className="w-full text-center"
              background="bg-blue-100"
              borderColor="border-blue-200"
            >
              <p className="text-2xl font-bold">{projectCounts.inProgress}</p>
              <p className="text-lg">In Progress</p>
            </DashedCard>
            <DashedCard
              className="w-full text-center"
              background="bg-olive-100"
              borderColor="border-olive-200"
            >
              <p className="text-2xl font-bold">{projectCounts.completed}</p>
              <p className="text-lg">Finished</p>
            </DashedCard>
          </div>
        </DashedCard>
      </div>

      <div className="flex flex-col gap-3">
        <h2>Recent Project Milestones</h2>
        {areMilestonesLoading ? (
          <p className="text-muted">Loading recent milestones...</p>
        ) : areMilestonesError ? (
          <p className="text-rose-500">Unable to load recent milestones.</p>
        ) : recentMilestones && recentMilestones.length > 0 ? (
          <ul className="grid gap-3 lg:grid-cols-3">
            {recentMilestones.map(({ projectName, milestone }) => (
              <li key={milestone.milestoneId}>
                <DashedCard className="h-full">
                  <div className="flex h-full flex-col gap-2">
                    <Link
                      className="text-primary hover:text-primary-hover text-xl underline"
                      to={`/projects/${milestone.projectId}`}
                    >
                      {projectName}
                    </Link>
                    <p className="whitespace-pre-wrap">{milestone.note}</p>
                    <div className="text-thread-400 mt-auto flex flex-wrap gap-x-6 gap-y-1">
                      {milestone.rowCount > 0 || milestone.repeatCount > 0 ? (
                        <>
                          <p>Rows: {milestone.rowCount}</p>
                          <p>Repeats: {milestone.repeatCount}</p>
                        </>
                      ) : null}
                    </div>
                    <p className="text-muted text-sm">
                      {formatDateTime(milestone.createdAt)}
                    </p>
                  </div>
                </DashedCard>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No milestones recorded yet.</p>
        )}
      </div>
    </div>
  )
}
