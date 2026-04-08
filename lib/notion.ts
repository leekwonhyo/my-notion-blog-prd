import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  BlockObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

/**
 * Notion 클라이언트 초기화
 */
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID || '';

/**
 * 환경 변수가 설정되어 있는지 확인
 */
function isConfigured(): boolean {
  return !!(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);
}

/**
 * Rich Text 배열을 일반 문자열로 변환
 */
function richTextToPlainText(richText: RichTextItemResponse[]): string {
  return richText.map((text) => text.plain_text).join('');
}

/**
 * 페이지 속성에서 필요한 정보 추출
 */
function extractPageProperties(page: PageObjectResponse) {
  const properties = page.properties;

  // Title 속성
  const titleProp = properties.Title;
  const title =
    titleProp?.type === 'title'
      ? richTextToPlainText(titleProp.title)
      : 'Untitled';

  // Slug 속성
  const slugProp = properties.Slug;
  const slug =
    slugProp?.type === 'rich_text'
      ? richTextToPlainText(slugProp.rich_text)
      : page.id;

  // Published 속성
  const publishedProp = properties.Published;
  const published =
    publishedProp?.type === 'checkbox' ? publishedProp.checkbox : false;

  // Date 속성
  const dateProp = properties.Date;
  const date =
    dateProp?.type === 'date' && dateProp.date
      ? dateProp.date.start
      : page.created_time;

  // Tags 속성
  const tagsProp = properties.Tags;
  const tags =
    tagsProp?.type === 'multi_select'
      ? tagsProp.multi_select.map((tag) => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        }))
      : [];

  // Description 속성
  const descProp = properties.Description;
  const description =
    descProp?.type === 'rich_text'
      ? richTextToPlainText(descProp.rich_text)
      : '';

  return {
    id: page.id,
    title,
    slug,
    published,
    date,
    tags,
    description,
  };
}

export type Post = ReturnType<typeof extractPageProperties>;

/**
 * 데이터베이스에서 공개된 글 목록 조회
 */
export async function getPosts(): Promise<Post[]> {
  if (!isConfigured()) {
    return [];
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });

  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(extractPageProperties);
}

/**
 * 슬러그로 단일 글 조회
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isConfigured()) {
    return null;
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: 'Slug',
          rich_text: {
            equals: slug,
          },
        },
        {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
      ],
    },
  });

  const page = response.results[0];
  if (!page || !('properties' in page)) {
    return null;
  }

  return extractPageProperties(page as PageObjectResponse);
}

/**
 * 페이지 블록 내용 조회
 */
export async function getPageContent(
  pageId: string
): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });

    blocks.push(
      ...response.results.filter(
        (block): block is BlockObjectResponse => 'type' in block
      )
    );

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks;
}

/**
 * 모든 공개된 글의 슬러그 목록 조회 (정적 생성용)
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getPosts();
  return posts.map((post) => post.slug);
}

/**
 * 모든 태그 목록 조회 (중복 제거)
 */
export async function getAllTags(): Promise<{ id: string; name: string; color: string }[]> {
  const posts = await getPosts();
  const tagMap = new Map<string, { id: string; name: string; color: string }>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!tagMap.has(tag.name)) {
        tagMap.set(tag.name, tag);
      }
    });
  });

  return Array.from(tagMap.values());
}

/**
 * 이전/다음 글 조회
 */
export async function getAdjacentPosts(
  currentSlug: string
): Promise<{ prev: Post | null; next: Post | null }> {
  const posts = await getPosts();
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
  };
}

/**
 * 블록에서 헤딩 정보 추출 (TOC용)
 */
export function extractHeadings(
  blocks: BlockObjectResponse[]
): { id: string; text: string; level: number }[] {
  return blocks
    .filter((block) =>
      ['heading_1', 'heading_2', 'heading_3'].includes(block.type)
    )
    .map((block) => {
      let text = '';
      let level = 1;

      if (block.type === 'heading_1') {
        text = block.heading_1.rich_text.map((t) => t.plain_text).join('');
        level = 1;
      } else if (block.type === 'heading_2') {
        text = block.heading_2.rich_text.map((t) => t.plain_text).join('');
        level = 2;
      } else if (block.type === 'heading_3') {
        text = block.heading_3.rich_text.map((t) => t.plain_text).join('');
        level = 3;
      }

      // ID 생성 (한글 지원)
      const id = text
        .toLowerCase()
        .replace(/[^\w\s가-힣]/g, '')
        .replace(/\s+/g, '-');

      return { id, text, level };
    });
}
