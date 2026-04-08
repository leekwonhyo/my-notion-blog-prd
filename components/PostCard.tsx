import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/lib/notion';

interface PostCardProps {
  post: Post;
}

/**
 * 글 목록에서 사용하는 카드 컴포넌트
 */
export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <Card className="transition-all hover:shadow-md hover:border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-4">
            <span className="group-hover:text-primary transition-colors">
              {post.title}
            </span>
            <ArrowRight className="h-5 w-5 flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {post.description && (
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {post.description}
            </p>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{formattedDate}</time>
            </div>

            {post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
