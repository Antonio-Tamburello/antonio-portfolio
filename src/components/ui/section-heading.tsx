import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  description?: string
  className?: string
  centered?: boolean
}

export function SectionHeading({ 
  title, 
  description, 
  className,
  centered = false 
}: SectionHeadingProps) {
  return (
    <div className={cn(
      'space-y-4',
      centered && 'text-center',
      className
    )}>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground max-w-2xl flex items-center justify-center mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}