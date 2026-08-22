export type AddProjectRequest = {
  username: string
  patternId: number
  name: string
  status: string
  isPublic: boolean
  care: string
  gauge: string
  tags: string[]
  dateStarted: string
  dateFinished: string
  dateNeededBy: string
}
