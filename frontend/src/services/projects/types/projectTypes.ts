import type {
  Pattern,
  PatternMaterial,
  PatternTool,
  PatternYarn,
} from '../../patterns/types/patternTypes'

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

export type ProjectDetails = {
  project: Project
  pattern: Pattern
  yarn: PatternYarn[]
  tools: PatternTool[]
  materials: PatternMaterial[]
}
