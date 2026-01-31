import { Badge as ShadcnBadge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TagProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

export function Tag({ children, variant = 'secondary', className, size = 'default' }: TagProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-sm px-2.5 py-0.5', 
    lg: 'text-sm px-3 py-1'
  }

  return (
    <ShadcnBadge 
      variant={variant} 
      className={cn(
        sizeClasses[size],
        'font-medium',
        className
      )}
    >
      {children}
    </ShadcnBadge>
  )
}