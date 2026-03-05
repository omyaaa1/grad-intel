import type { StudentProfile } from "@/lib/types"

const STORAGE_KEY = "gradintel.studentProfile"

export const defaultProfile: StudentProfile = {
  name: "Rahul Sharma",
  country: "USA",
  course: "Computer Science",
  cgpa: 8.2,
  ielts: 6.5,
  budget: 40000,
}

export function getStoredProfile(): StudentProfile {
  if (typeof window === "undefined") {
    return defaultProfile
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return defaultProfile
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StudentProfile>
    return {
      name: parsed.name || defaultProfile.name,
      country: parsed.country || defaultProfile.country,
      course: parsed.course || defaultProfile.course,
      cgpa: Number(parsed.cgpa ?? defaultProfile.cgpa),
      ielts: Number(parsed.ielts ?? defaultProfile.ielts),
      budget: Number(parsed.budget ?? defaultProfile.budget),
    }
  } catch {
    return defaultProfile
  }
}

export function setStoredProfile(profile: StudentProfile): void {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}
