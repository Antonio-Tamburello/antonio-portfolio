import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import {
  ProfileSchema,
  ProjectsSchema,
  ExperiencesSchema,
  CaseStudyFrontmatterSchema,
  type Profile,
  type Project,
  type Experience,
  type CaseStudyFrontmatter
} from './schemas'

const contentDir = path.join(process.cwd(), 'src/content')

// Get profile data
export async function getProfile(): Promise<Profile> {
  try {
    const filePath = path.join(contentDir, 'profile.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    return ProfileSchema.parse(data)
  } catch (error) {
    console.error('Error loading profile:', error)
    throw new Error('Failed to load profile data')
  }
}

// Get all projects
export async function getProjects(): Promise<Project[]> {
  try {
    const filePath = path.join(contentDir, 'projects.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    return ProjectsSchema.parse(data)
  } catch (error) {
    console.error('Error loading projects:', error)
    throw new Error('Failed to load projects data')
  }
}

// Get featured projects only
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter(project => project.isFeatured)
}

// Get project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects()
  return projects.find(project => project.id === id) || null
}

// Get projects by category
export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter(project => project.category === category)
}

// Get all experiences
export async function getExperiences(): Promise<Experience[]> {
  try {
    const filePath = path.join(contentDir, 'experience.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    const experiences = ExperiencesSchema.parse(data)
    // Sort by start date (most recent first)
    return experiences.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  } catch (error) {
    console.error('Error loading experience:', error)
    throw new Error('Failed to load experience data')
  }
}

// Get current experience
export async function getCurrentExperience(): Promise<Experience | null> {
  const experiences = await getExperiences()
  return experiences.find(exp => exp.current) || null
}

// Get case studies
export async function getCaseStudies(): Promise<Array<CaseStudyFrontmatter & { content: string }>> {
  try {
    const caseStudiesDir = path.join(contentDir, 'case-studies')
    const files = await fs.readdir(caseStudiesDir)
    const mdxFiles = files.filter(file => file.endsWith('.mdx'))
    
    const caseStudies = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(caseStudiesDir, file)
        const fileContent = await fs.readFile(filePath, 'utf8')
        const { data, content } = matter(fileContent)
        
        const frontmatter = CaseStudyFrontmatterSchema.parse({
          ...data,
          slug: data.slug || path.basename(file, '.mdx')
        })
        
        return {
          ...frontmatter,
          content
        }
      })
    )
    
    // Sort by published date (most recent first)
    return caseStudies.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  } catch (error) {
    console.error('Error loading case studies:', error)
    throw new Error('Failed to load case studies')
  }
}

// Get case study by slug
export async function getCaseStudyBySlug(slug: string): Promise<(CaseStudyFrontmatter & { content: string }) | null> {
  const caseStudies = await getCaseStudies()
  return caseStudies.find(study => study.slug === slug) || null
}

// Get featured case studies
export async function getFeaturedCaseStudies(): Promise<Array<CaseStudyFrontmatter & { content: string }>> {
  const caseStudies = await getCaseStudies()
  return caseStudies.filter(study => study.featured)
}

// Get latest case study
export async function getLatestCaseStudy(): Promise<(CaseStudyFrontmatter & { content: string }) | null> {
  const caseStudies = await getCaseStudies()
  return caseStudies[0] || null
}