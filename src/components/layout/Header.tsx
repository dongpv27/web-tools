'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, Code, FileText, Image, Youtube, Palette, ArrowLeftRight, Wrench } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import { categories } from '@/lib/categories';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  FileText,
  Image,
  Youtube,
  Palette,
  ArrowLeftRight,
  Wrench,
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Code className="w-6 h-6" />
            <span>WebTools</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/tools" className="text-gray-600 hover:text-blue-600 transition-colors">
              All Tools
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                Categories
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {categories.map((category) => {
                  const Icon = iconMap[category.icon];
                  return (
                    <Link
                      key={category.id}
                      href={`/tools/${category.slug}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.toolCount} tools</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block w-64">
            <SearchBar />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="mb-4">
              <SearchBar />
            </div>
            <nav className="space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/tools"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                All Tools
              </Link>
              {categories.map((category) => {
                const Icon = iconMap[category.icon];
                return (
                  <Link
                    key={category.id}
                    href={`/tools/${category.slug}`}
                    className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{category.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
