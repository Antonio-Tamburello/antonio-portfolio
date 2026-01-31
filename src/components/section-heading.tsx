import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  className?: string
  centered?: boolean
}

export function SectionHeading({ title, subtitle, className, centered = false }: SectionHeadingProps) {
  return (
    <div className={cn('space-y-2', centered && 'text-center', className)}>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl ">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-lg text-muted-foreground max-w-2xl", centered && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  )
}