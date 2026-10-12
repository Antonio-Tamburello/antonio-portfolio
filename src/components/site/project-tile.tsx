import type { Project } from '@/content/schemas';
import { Eyebrow, Tile } from './bento';

/**
 * A project card. Work-in-progress projects get a dashed border;
 * every card links to its detail page.
 */
export function ProjectTile({ project, className }: { project: Project; className?: string }) {
  const variant = project.status === 'wip' ? 'dashed' : 'default';
  return (
    <Tile
      href={`/projects/${project.id}`}
      variant={variant}
      className={className ?? 'min-h-[150px] flex-[1_1_260px]'}
    >
      <Eyebrow className="text-muted-foreground opacity-100">
        {project.label ?? project.category}
      </Eyebrow>
      <span className="text-xl font-semibold">{project.title}</span>
      <span className="text-[15px] leading-relaxed text-muted-foreground">
        {project.description}
      </span>
    </Tile>
  );
}
