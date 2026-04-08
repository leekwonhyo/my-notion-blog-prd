import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getPageContent, getAllPostSlugs } from '@/lib/notion';
import PostContent from '@/components/PostContent';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60; // ISR: 60초마다 재검증

/**
 * 정적 경로 생성 (빌드 시 모든 글 페이지 생성)
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

  return {
    title: post.title,
    description: post.description || `Read ${post.title} on My Blog`,
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

  const blocks = await getPageContent(post.id);

  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article>
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          &larr; Back to posts
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 flex-wrap text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={post.date}>{formattedDate}</time>

          {post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {post.description && (
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {post.description}
          </p>
        )}
      </header>

      <PostContent blocks={blocks} />
    </article>
  );
}
