export type PatternYarn = {
  weight: number
  yardage: number
  grams: number
  description: string
}

export type PatternTool = {
  toolType: string
  sizeMm: number
}

export type PatternMaterial = {
  name: string
  description: string
  quantity: number
}

export type AddPatternRequest = {
  username: string
  name: string
  designer: string
  category: string
  technique: string
  difficulty: string
  description: string
  link: string
  imageUrl: string
  tags: string[]
  yarn: PatternYarn[]
  tools: PatternTool[]
  materials: PatternMaterial[]
}
