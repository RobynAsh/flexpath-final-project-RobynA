export type AddMilestoneRequest = {
  note: string
  rowCount: number
  repeatCount: number
}

export type Milestone = AddMilestoneRequest & {
  milestoneId: number
  projectId: number
  createdAt: string
  updatedAt: string
}
