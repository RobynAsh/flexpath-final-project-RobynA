export type Project = {
  projectId: number
  username: string
  patternId: number
  name: string
  status: string
  public: boolean
  care: string | null
  gauge: string | null
  dateStarted: string | null
  dateFinished: string | null
  dateNeededBy: string | null
  createdAt: string
  updatedAt: string
}
