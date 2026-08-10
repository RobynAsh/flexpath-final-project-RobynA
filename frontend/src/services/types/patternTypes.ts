export type Pattern = {
  patternId: number
  username: string
  category: string | null
  technique: string | null
  name: string
  designer: string | null
  description: string | null
  difficulty: string | null
  link: string | null
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export type PatternTag = {
  tagId: number
  username: string
  name: string
}

export type PatternYarn = {
  patternYarnId: number
  patternId: number
  suggestedYarnId: number | null
  description: string | null
  weight: number
  yardage: number
  grams: number
}

export type PatternTool = {
  patternToolId: number
  patternId: number
  toolType: string
  sizeMm: number
}

export type PatternMaterial = {
  patternMaterialId: number
  patternId: number
  name: string
  description: string | null
  quantity: number
  createdAt: string
  updatedAt: string
}

export type PatternDetails = {
  pattern: Pattern
  tags: PatternTag[]
  yarn: PatternYarn[]
  tools: PatternTool[]
  materials: PatternMaterial[]
}
