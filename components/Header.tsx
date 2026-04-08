import Link from 'next/link';
import { PenLine } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

/**
 * 블로그 공통 헤더 컴포넌트
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold hover:text-primary transition-colors"
        >
          <PenLine className="h-5 w-5" />
          <span>My Blog</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Posts
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
