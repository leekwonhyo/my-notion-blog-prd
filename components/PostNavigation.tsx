import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Post } from '@/lib/notion';

interface PostNavigationProps {
  prevPost: Post | null;
  nextPost: Post | null;
}

/**
 * 이전/다음 글 네비게이션 컴포넌트
 */
export function PostNavigation({ prevPost, nextPost }: PostNavigationProps) {
  if (!prevPost && !nextPost) return null;

  return (
    <nav className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t">
      {prevPost ? (
        <Link
          href={`/posts/${prevPost.slug}`}
          className="flex-1 group p-4 rounded-lg border hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <ChevronLeft className="h-4 w-4" />
            <span>이전 글</span>
          </div>
          <div className="font-medium group-hover:text-primary transition-colors line-clamp-1">
            {prevPost.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {nextPost ? (
        <Link
          href={`/posts/${nextPost.slug}`}
          className="flex-1 group p-4 rounded-lg border hover:border-primary transition-colors text-right"
        >
          <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-1">
            <span>다음 글</span>
            <ChevronRight className="h-4 w-4" />
          </div>
          <div className="font-medium group-hover:text-primary transition-colors line-clamp-1">
            {nextPost.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
