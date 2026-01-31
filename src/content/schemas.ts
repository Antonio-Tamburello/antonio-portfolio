import { z } from 'zod'

// Profile Schema
export const ProfileSchema = z.object({
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  location: z.string(),
  email: z.email(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  avatar: z.string(),
  resume: z.string().optional(),
  skills: z.array(z.string()),
  highlights: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional()
  }))
})

// Project Schema
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  longDescription: z.string().optional(),
  image: z.string().optional(),
  technologies: z.array(z.string()),
  githubUrl: z.string().nullable().optional(),
  demoUrl: z.string().optional(),
  screenshots: z.array(z.string()).optional(),
  status: z.enum(['active', 'wip', 'archived']),
  isFeatured: z.boolean().default(false),
  category: z.string(),
  tags: z.array(z.string()).default([])
})

export const ProjectsSchema = z.array(ProjectSchema)

// Experience Schema
export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string()),
  technologies: z.array(z.string()),
  companyLogo: z.string().url().optional(),
  companyUrl: z.string().url().optional()
})

export const ExperiencesSchema = z.array(ExperienceSchema)

// Case Study Frontmatter Schema
export const CaseStudyFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishedAt: z.string(),
  image: z.string(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  readingTime: z.string().optional(),
  category: z.string(),
  slug: z.string(),
  projectUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  demoUrl: z.string().optional()
})

// Export types
export type Profile = z.infer<typeof ProfileSchema>
export type Project = z.infer<typeof ProjectSchema>
export type Experience = z.infer<typeof ExperienceSchema>
export type CaseStudyFrontmatter = z.infer<typeof CaseStudyFrontmatterSchema>