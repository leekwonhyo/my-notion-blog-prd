import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/notion';

export const runtime = 'edge';

export const alt = 'Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * 글별 동적 OG 이미지 생성
 */
export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title || 'Post Not Found';
  const description = post?.description || '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0a0a0a',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: title.length > 40 ? '48px' : '64px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: '28px',
                color: '#a1a1aa',
                lineHeight: 1.4,
              }}
            >
              {description.length > 100
                ? description.substring(0, 100) + '...'
                : description}
            </p>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '24px',
              color: '#71717a',
            }}
          >
            My Blog
          </span>
          {post?.date && (
            <span
              style={{
                fontSize: '24px',
                color: '#71717a',
              }}
            >
              {new Date(post.date).toLocaleDateString('ko-KR')}
            </span>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
