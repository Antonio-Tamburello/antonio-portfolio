"use client";

import { Container } from '@/components/container';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ProjectCard } from '@/components/project-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SectionHeading } from '@/components/ui/section-heading';
import profile from '@/content/profile.json';
import { type Project } from '@/content/schemas';
import { Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ProjectsPageClientProps {
	projects: Project[]
}

export function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [selectedTech, setSelectedTech] = useState<string>('all')

	// Get unique values for filters
	const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))]
	const technologies = ['all', ...Array.from(new Set(projects.flatMap(p => p.technologies)))]

	// Filter projects
	const filteredProjects = useMemo(() => {
		return projects.filter(project => {
			const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
			const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
			const matchesTech = selectedTech === 'all' || project.technologies.includes(selectedTech)
			return matchesSearch && matchesCategory && matchesTech
		})
	}, [projects, searchQuery, selectedCategory, selectedTech])

	const clearFilters = () => {
		setSearchQuery('')
		setSelectedCategory('all')
		setSelectedTech('all')
	}

	const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedTech !== 'all'

	return (
		<div className="min-h-screen">
			<Header />

			<div className="py-16">
				<Container>
					<SectionHeading
						title="All Projects"
						description={`${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} found`}
						centered
						className="mb-12"
					/>

					{/* Search and Filters */}
					<Card className="mb-8">
						<CardContent className="p-6">
							<div className="space-y-6">
								{/* Search */}
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
									<Input
										placeholder="Search projects, technologies, or descriptions..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10"
									/>
								</div>

								{/* Filter Buttons */}
								<div className="space-y-4">
									<div className="flex items-center gap-2 text-sm font-medium">
										<Filter className="h-4 w-4" />
										Filters
									</div>

									{/* Category Filter */}
									<div className="space-y-2">
										<div className='mb-2'>
											<label className="text-sm font-medium text-muted-foreground">Category</label>
										</div>
										<div className="flex flex-wrap gap-2">
											{categories.map(category => (
												<Badge
													key={category}
													variant={selectedCategory === category ? "default" : "outline"}
													className="cursor-pointer hover:bg-primary/10 transition-colors"
													onClick={() => setSelectedCategory(category)}
												>
													{category}
												</Badge>
											))}
										</div>
									</div>

									{/* Technology Filter */}
									<div className="space-y-2">
										<div className='mb-2'>
											<label className="text-sm font-medium text-muted-foreground">Technology</label>
										</div>
										<div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
											{technologies.slice(0, 20).map(tech => (
												<Badge
													key={tech}
													variant={selectedTech === tech ? "default" : "outline"}
													className="cursor-pointer hover:bg-primary/10 transition-colors text-xs"
													onClick={() => setSelectedTech(tech)}
												>
													{tech}
												</Badge>
											))}
										</div>
									</div>

									{/* Clear Filters */}
									{hasActiveFilters && (
										<div className="pt-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={clearFilters}
												className="text-muted-foreground hover:text-foreground"
											>
												Clear all filters
											</Button>
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Projects Grid */}
					{filteredProjects.length > 0 ? (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredProjects.map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					) : (
						<Card className="text-center py-12">
							<CardContent>
								<div className="text-muted-foreground space-y-2">
									<h3 className="text-lg font-medium">No projects found</h3>
									<p>Try adjusting your search or filters</p>
									{hasActiveFilters && (
										<Button variant="outline" onClick={clearFilters} className="mt-4">
											Clear filters
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					)}
				</Container>
			</div>

			<Footer
				socialLinks={[
					profile.github ? { name: 'GitHub', href: profile.github } : null,
					profile.linkedin ? { name: 'LinkedIn', href: profile.linkedin } : null,
					profile.email ? { name: 'Email', href: `mailto:${profile.email}` } : null,
				].filter((item): item is { name: string; href: string } => item !== null)}
			/>
		</div>
	)
}
