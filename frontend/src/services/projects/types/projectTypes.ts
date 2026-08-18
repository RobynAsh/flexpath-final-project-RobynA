import type {
  Pattern,
  PatternMaterial,
  PatternTool,
  PatternTag,
  PatternYarn,
} from '../../patterns/types/patternTypes'
import type { Milestone } from '../../milestones/types/milestoneTypes'

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
  tags: PatternTag[]
  pattern: Pattern
  yarn: PatternYarn[]
  tools: PatternTool[]
  materials: PatternMaterial[]
  milestones: Milestone[]
}

export type ProjectSummary = {
  project: Project
  tags: PatternTag[]
}
