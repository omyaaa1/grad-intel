export type StudentProfile = {
  name: string
  country: string
  course: string
  cgpa: number
  ielts: number
  budget: number
}

export type University = {
  tier: string
  country: string
  city: string
  university: string
  course: string
  score: number
  minCgpa: number
  minIelts: number
  gre: number
  tuitionUsd: number
  livingCostUsd: number
  totalCostUsd: number
  avgSalaryUsd: number
  acceptanceRate: number
  jobMarketScore: number
  roi: number
  visaDifficulty: number
  latitude: number
  longitude: number
}

export type MapPoint = {
  country: string
  lat: number
  lng: number
  avgScore: number
  acceptanceRate: number
}

export type Prediction = {
  student: StudentProfile
  suggestions: string[]
  universities: University[]
  allMatches: University[]
  insights: {
    admissionChance: string
    roi: string
    visaDifficulty: string
  }
  mapData: MapPoint[]
  totalMatches: number
}
