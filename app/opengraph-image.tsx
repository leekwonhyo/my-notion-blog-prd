import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'My Blog';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

/**
 * 기본 OG 이미지 생성
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '20px',
            }}
          >
            My Blog
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: '#a1a1aa',
            }}
          >
            Thoughts, ideas, and stories
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
