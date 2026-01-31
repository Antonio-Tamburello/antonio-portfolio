import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { TagList } from '@/components/tag'
import { type Experience } from '@/content/schemas'
import { ExternalLink, MapPin, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ExperienceItemProps {
  experience: Experience
  showTimeline?: boolean
}

export function ExperienceItem({ experience, showTimeline = true }: ExperienceItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  }

  const getDateRange = () => {
    const start = formatDate(experience.startDate)
    const end = experience.current ? 'Present' : experience.endDate ? formatDate(experience.endDate) : 'Present'
    return `${start} - ${end}`
  }

  const getDuration = () => {
    const startDate = new Date(experience.startDate)
    const endDate = experience.current || !experience.endDate ? new Date() : new Date(experience.endDate)
    const months = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (years === 0) {
      return `${months} ${months === 1 ? 'month' : 'months'}`
    } else if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`
    } else {
      return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`
    }
  }

  return (
    <div className={`flex gap-4 ${showTimeline ? 'relative' : ''}`}>
      {showTimeline && (
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 bg-primary rounded-full border-2 border-background shadow-md" />
          <div className="w-px bg-border flex-1 mt-2" />
        </div>
      )}
      
      <Card className="flex-1 mb-6 z-10">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg">
                    {experience.position}
                  </h3>
                  {experience.current && (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      Current
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  {experience.companyUrl ? (
                    <Link 
                      href={experience.companyUrl} 
                      className="font-medium hover:text-primary transition-colors flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {experience.company}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="font-medium">{experience.company}</span>
                  )}
                  
                  {experience.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {experience.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {getDateRange()}
                </div>
                <div className="mt-1">
                  {getDuration()}
                </div>
              </div>
            </div>
            
            {experience.description && (
              <p className="text-muted-foreground">
                {experience.description}
              </p>
            )}
            
            {experience.achievements.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Key Achievements:</h4>
                <ul className="space-y-1">
                  {experience.achievements.map((achievement, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2 shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {experience.technologies.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Technologies:</h4>
                <TagList tags={experience.technologies} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}