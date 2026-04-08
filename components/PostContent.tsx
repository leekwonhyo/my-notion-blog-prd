import Image from 'next/image';
import { BlockObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

interface PostContentProps {
  blocks: BlockObjectResponse[];
}

/**
 * 텍스트를 slug로 변환 (ID 생성용)
 */
function textToSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '')
    .replace(/\s+/g, '-');
}

/**
 * Rich Text를 JSX로 렌더링
 */
function renderRichText(richText: RichTextItemResponse[]) {
  return richText.map((text, index) => {
    const { annotations, plain_text, href } = text;

    let element: React.ReactNode = plain_text;

    if (annotations.bold) {
      element = <strong key={`bold-${index}`}>{element}</strong>;
    }
    if (annotations.italic) {
      element = <em key={`italic-${index}`}>{element}</em>;
    }
    if (annotations.strikethrough) {
      element = <del key={`strike-${index}`}>{element}</del>;
    }
    if (annotations.underline) {
      element = <u key={`underline-${index}`}>{element}</u>;
    }
    if (annotations.code) {
      element = (
        <code
          key={`code-${index}`}
          className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono"
        >
          {element}
        </code>
      );
    }
    if (href) {
      element = (
        <a
          key={`link-${index}`}
          href={href}
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {element}
        </a>
      );
    }

    return <span key={index}>{element}</span>;
  });
}

/**
 * 단일 블록을 JSX로 렌더링
 */
function renderBlock(block: BlockObjectResponse) {
  const { type, id } = block;

  switch (type) {
    case 'paragraph':
      return (
        <p key={id} className="mb-4 leading-relaxed">
          {renderRichText(block.paragraph.rich_text)}
        </p>
      );

    case 'heading_1': {
      const text = block.heading_1.rich_text.map((t) => t.plain_text).join('');
      const headingId = textToSlug(text);
      return (
        <h1 key={id} id={headingId} className="text-3xl font-bold mt-8 mb-4 scroll-mt-20">
          {renderRichText(block.heading_1.rich_text)}
        </h1>
      );
    }

    case 'heading_2': {
      const text = block.heading_2.rich_text.map((t) => t.plain_text).join('');
      const headingId = textToSlug(text);
      return (
        <h2 key={id} id={headingId} className="text-2xl font-bold mt-6 mb-3 scroll-mt-20">
          {renderRichText(block.heading_2.rich_text)}
        </h2>
      );
    }

    case 'heading_3': {
      const text = block.heading_3.rich_text.map((t) => t.plain_text).join('');
      const headingId = textToSlug(text);
      return (
        <h3 key={id} id={headingId} className="text-xl font-bold mt-4 mb-2 scroll-mt-20">
          {renderRichText(block.heading_3.rich_text)}
        </h3>
      );
    }

    case 'bulleted_list_item':
      return (
        <li key={id} className="ml-6 mb-2 list-disc">
          {renderRichText(block.bulleted_list_item.rich_text)}
        </li>
      );

    case 'numbered_list_item':
      return (
        <li key={id} className="ml-6 mb-2 list-decimal">
          {renderRichText(block.numbered_list_item.rich_text)}
        </li>
      );

    case 'to_do':
      return (
        <div key={id} className="flex items-start gap-2 mb-2">
          <input
            type="checkbox"
            checked={block.to_do.checked}
            readOnly
            className="mt-1 rounded"
          />
          <span className={block.to_do.checked ? 'line-through text-muted-foreground' : ''}>
            {renderRichText(block.to_do.rich_text)}
          </span>
        </div>
      );

    case 'toggle':
      return (
        <details key={id} className="mb-4">
          <summary className="cursor-pointer font-medium">
            {renderRichText(block.toggle.rich_text)}
          </summary>
        </details>
      );

    case 'code':
      return (
        <pre
          key={id}
          className="mb-4 p-4 rounded-lg bg-muted overflow-x-auto"
        >
          <code className="text-sm font-mono">
            {block.code.rich_text.map((t) => t.plain_text).join('')}
          </code>
        </pre>
      );

    case 'quote':
      return (
        <blockquote
          key={id}
          className="mb-4 pl-4 border-l-4 border-primary/50 italic text-muted-foreground"
        >
          {renderRichText(block.quote.rich_text)}
        </blockquote>
      );

    case 'divider':
      return <hr key={id} className="my-8 border-border" />;

    case 'callout':
      return (
        <div
          key={id}
          className="mb-4 p-4 rounded-lg bg-muted flex gap-3"
        >
          {block.callout.icon?.type === 'emoji' && (
            <span className="text-xl">{block.callout.icon.emoji}</span>
          )}
          <div>{renderRichText(block.callout.rich_text)}</div>
        </div>
      );

    case 'image': {
      const imageUrl =
        block.image.type === 'external'
          ? block.image.external.url
          : block.image.file.url;
      const caption =
        block.image.caption.length > 0
          ? block.image.caption.map((c) => c.plain_text).join('')
          : '';

      // Notion 내부 이미지는 next/image 사용 불가 (서명된 URL)
      const isExternalImage = block.image.type === 'external';

      return (
        <figure key={id} className="mb-4">
          {isExternalImage ? (
            <Image
              src={imageUrl}
              alt={caption || 'Blog image'}
              width={800}
              height={400}
              className="rounded-lg w-full h-auto"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={caption || 'Blog image'}
              className="rounded-lg max-w-full h-auto"
            />
          )}
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'bookmark':
      return (
        <a
          key={id}
          href={block.bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4 p-4 rounded-lg border hover:bg-muted transition-colors"
        >
          <span className="text-primary hover:underline break-all">
            {block.bookmark.url}
          </span>
        </a>
      );

    default:
      return null;
  }
}

/**
 * Notion 블록 목록을 HTML로 렌더링하는 컴포넌트
 */
export default function PostContent({ blocks }: PostContentProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
}
