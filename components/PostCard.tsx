import Link from 'next/link';
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
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h2>

          {post.description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
              {post.description}
            </p>
          )}

          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <time
              dateTime={post.date}
              className="text-sm text-gray-500 dark:text-gray-500"
            >
              {formattedDate}
            </time>

            {post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
