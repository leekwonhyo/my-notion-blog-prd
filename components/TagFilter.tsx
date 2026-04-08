'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagFilterProps {
  tags: Tag[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

/**
 * 태그 필터 컴포넌트
 */
export function TagFilter({ tags, selectedTag, onSelectTag }: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={selectedTag === null ? 'default' : 'outline'}
        className={cn(
          'cursor-pointer transition-colors',
          selectedTag === null && 'bg-primary'
        )}
        onClick={() => onSelectTag(null)}
      >
        All
      </Badge>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={selectedTag === tag.name ? 'default' : 'outline'}
          className={cn(
            'cursor-pointer transition-colors',
            selectedTag === tag.name && 'bg-primary'
          )}
          onClick={() => onSelectTag(tag.name)}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
