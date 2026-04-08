import { getPosts } from '@/lib/notion';
import PostCard from '@/components/PostCard';

export const revalidate = 60; // ISR: 60초마다 재검증

/**
 * 블로그 글 목록 페이지 (홈)
 */
export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div>
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to My Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Thoughts, ideas, and stories.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No posts yet. Check back later!
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
