import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TagProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  className?: string
}

export function Tag({ children, variant = 'secondary', className }: TagProps) {
  return (
    <Badge variant={variant} className={cn('text-xs', className)}>
      {children}
    </Badge>
  )
}

interface TagListProps {
  tags: string[]
  className?: string
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

export function TagList({ tags, className, variant = 'secondary' }: TagListProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <Tag key={tag} variant={variant}>
          {tag}
        </Tag>
      ))}
    </div>
  )
}