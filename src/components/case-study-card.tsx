import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { TagList } from '@/components/tag'
import { type CaseStudyFrontmatter } from '@/content/schemas'
import { Calendar, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface CaseStudyCardProps {
  caseStudy: CaseStudyFrontmatter
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <Link href={`/case-studies/${caseStudy.slug}`}>
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={caseStudy.image}
            alt={caseStudy.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {caseStudy.featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary/90">
                Featured
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {caseStudy.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {caseStudy.description}
              </p>
            </div>
            
            <TagList tags={caseStudy.tags} />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(caseStudy.publishedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                {caseStudy.readingTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {caseStudy.readingTime}
                  </span>
                )}
              </div>
              <span>{caseStudy.category}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}