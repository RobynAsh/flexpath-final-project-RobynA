export type AddMilestoneRequest = {
  note: string
  rowCount: number
  repeatCount: number
}

export type AdminMilestoneRequest = AddMilestoneRequest & {
  projectId: number
}

export type Milestone = AddMilestoneRequest & {
  milestoneId: number
  projectId: number
  createdAt: string
  updatedAt: string
}

export type RecentMilestone = {
  projectName: string
  milestone: Milestone
}

export type AdminMilestoneDetails = {
  projectName: string
  username: string
  milestone: Milestone
}
