import Link from 'next/link';

/**
 * 블로그 공통 헤더 컴포넌트
 */
export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            My Blog
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Posts
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
