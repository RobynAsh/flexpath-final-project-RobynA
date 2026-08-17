export type AddProjectRequest = {
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
