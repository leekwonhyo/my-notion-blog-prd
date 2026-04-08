import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import {
  getPostBySlug,
  getPageContent,
  getAllPostSlugs,
  getAdjacentPosts,
  extractHeadings,
} from '@/lib/notion';
import { Badge } from '@/components/ui/badge';
import PostContent from '@/components/PostContent';
import { PostNavigation } from '@/components/PostNavigation';
import { ShareButtons } from '@/components/ShareButtons';
import { TableOfContents } from '@/components/TableOfContents';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60; // ISR: 60초마다 재검증

/**
 * 정적 경로 생성 (빌드 시 모든 글 페��지 생성)
 */
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: post.title,
    description: post.description || `Read ${post.title} on My Blog`,
    openGraph: {
      title: post.title,
      description: post.description || `Read ${post.title} on My Blog`,
      type: 'article',
      publishedTime: post.date,
      url: `${siteUrl}/posts/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || `Read ${post.title} on My Blog`,
    },
  };
}

/**
 * 글 상세 페이지
 */
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [blocks, adjacentPosts] = await Promise.all([
    getPageContent(post.id),
    getAdjacentPosts(slug),
  ]);

  const headings = extractHeadings(blocks);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const postUrl = `${siteUrl}/posts/${post.slug}`;

  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="relative">
      {/* 목차 (데스크톱) */}
      <TableOfContents items={headings} />

      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to posts
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{formattedDate}</time>
          </div>

          {post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {post.description && (
          <p className="text-lg text-muted-foreground">{post.description}</p>
        )}
      </header>

      <PostContent blocks={blocks} />

      {/* 공유 버튼 */}
      <div className="mt-8 pt-8 border-t">
        <ShareButtons title={post.title} url={postUrl} />
      </div>

      {/* 이전/다음 글 네비게이션 */}
      <PostNavigation prevPost={adjacentPosts.prev} nextPost={adjacentPosts.next} />
    </article>
  );
}
