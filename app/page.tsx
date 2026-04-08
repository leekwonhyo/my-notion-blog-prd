import { getPosts, getAllTags } from '@/lib/notion';
import { PostList } from '@/components/PostList';

export const revalidate = 60; // ISR: 60초마다 재검증

/**
 * 블로그 글 목록 페이지 (홈)
 */
export default async function HomePage() {
  const [posts, tags] = await Promise.all([getPosts(), getAllTags()]);

  return (
    <div>
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
        <p className="text-lg text-muted-foreground">
          Thoughts, ideas, and stories.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
        <PostList posts={posts} tags={tags} />
      </section>
    </div>
  );
}
