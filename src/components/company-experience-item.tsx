import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { TagList } from '@/components/tag';
import { ExternalLink, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Role {
  id: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements: string[];
  technologies: string[];
  companyLogo?: string;
  companyUrl?: string;
  location?: string;
}

interface CompanyExperienceItemProps {
  company: string;
  location?: string;
  companyLogo?: string;
  companyUrl?: string;
  roles: Role[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function CompanyExperienceItem({ company, location, companyLogo, companyUrl, roles }: CompanyExperienceItemProps) {
  // Calcola il periodo totale per l'azienda
  const sortedRoles = [...roles].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  const firstStart = sortedRoles[0]?.startDate
  const lastRole = sortedRoles.reduce((latest, curr) => {
    const currEnd = curr.current ? new Date() : curr.endDate ? new Date(curr.endDate) : new Date()
    const latestEnd = latest.current ? new Date() : latest.endDate ? new Date(latest.endDate) : new Date()
    return currEnd > latestEnd ? curr : latest
  }, sortedRoles[0])
  const lastEnd = lastRole?.current ? undefined : lastRole?.endDate
  const isCurrent = lastRole?.current
  const totalPeriod = firstStart ? `${formatDate(firstStart)} - ${isCurrent ? 'Present' : lastEnd ? formatDate(lastEnd) : 'Present'}` : ''
  const totalDuration = firstStart ? getDuration(firstStart, lastEnd, isCurrent) : ''

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            {companyLogo && (
              <img src={companyLogo} alt={company} className="w-10 h-10 rounded-full object-contain border" />
            )}
            {companyUrl ? (
              <Link href={companyUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-lg flex items-center gap-1">
                {company}
                <ExternalLink className="w-4 h-4" />
              </Link>
            ) : (
              <span className="font-bold text-lg">{company}</span>
            )}
            {location && (
              <span className="flex items-center gap-1 text-muted-foreground ml-2">
                <MapPin className="w-4 h-4" />
                {location}
              </span>
            )}
            {/* Total period at the top right */}
            <div className="ml-auto text-right">
              <div className="font-semibold">
                {totalPeriod}
              </div>
              <div className="text-xs">
                {totalDuration}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {roles.map((role) => (
              <div key={role.id} className="border-l-2 border-primary pl-4 flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-base">{role.position}</span>
                    {role.current && (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Current</Badge>
                    )}
                  </div>
                  {role.description && (
                    <div className="prose prose-sm text-muted-foreground mb-2 whitespace-pre-line">{role.description}</div>
                  )}
                  {role.achievements.length > 0 && (
                    <div className="mb-2">
                      <h4 className="font-medium text-xs mb-1">Key Achievements:</h4>
                      <ul className="list-disc pl-5">
                        {role.achievements.map((ach, idx) => (
                          <li key={idx} className="text-base text-muted-foreground leading-relaxed py-1">{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {role.technologies.length > 0 && (
                    <div className="mb-2">
                      <h4 className="font-medium text-xs mb-1">Technologies:</h4>
                      <TagList tags={role.technologies} />
                    </div>
                  )}
                </div>
                <div className="sm:text-right sm:pl-8 mt-2 sm:mt-0 min-w-40">
                  <div className="text-xs text-muted-foreground">
                    {formatDate(role.startDate)} - {role.current ? 'Present' : role.endDate ? formatDate(role.endDate) : 'Present'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {getDuration(role.startDate, role.endDate, role.current)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Funzione per calcolare la durata
function getDuration(startDate: string, endDate?: string, current?: boolean) {
  const start = new Date(startDate)
  const end = current || !endDate ? new Date() : new Date(endDate)
  const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
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
