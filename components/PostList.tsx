'use client';

import { useState, useMemo, useCallback } from 'react';
import { Post } from '@/lib/notion';
import PostCard from './PostCard';
import { SearchBar } from './SearchBar';
import { TagFilter } from './TagFilter';

interface PostListProps {
  posts: Post[];
  tags: { id: string; name: string; color: string }[];
}

/**
 * 검색 및 태그 필터링이 가능한 글 목록 컴포넌트
 */
export function PostList({ posts, tags }: PostListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSelectTag = useCallback((tag: string | null) => {
    setSelectedTag(tag);
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 검색어 필터
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());

      // 태그 필터
      const matchesTag =
        selectedTag === null ||
        post.tags.some((tag) => tag.name === selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mb-6">
          <TagFilter
            tags={tags}
            selectedTag={selectedTag}
            onSelectTag={handleSelectTag}
          />
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || selectedTag
              ? '검색 결과가 없습니다.'
              : '아직 작성된 글��� 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
