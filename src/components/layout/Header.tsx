'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, Code, FileText, Image, Youtube, Palette, ArrowLeftRight, Wrench, FileSpreadsheet, LayoutGrid, ChevronDown } from 'lucide-react';
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
  FileSpreadsheet,
};

// Popular categories to show in main nav
const popularCategoryIds = ['dev', 'text', 'image', 'office'];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  const popularCategories = categories.filter((cat) => popularCategoryIds.includes(cat.id));

  // Close category dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition-colors">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span>WebTools</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              Home
            </Link>

            {/* Popular Categories */}
            {popularCategories.map((category) => {
              const Icon = iconMap[category.icon];
              return (
                <Link
                  key={category.id}
                  href={`/tools/${category.slug}`}
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1.5"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{category.name.replace(' Tools', '')}</span>
                </Link>
              );
            })}

            {/* All Categories Button */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  isCategoryOpen
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>All Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {isCategoryOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[640px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700">
                    <h3 className="text-white font-semibold">All Categories</h3>
                    <p className="text-blue-100 text-sm">Browse all {categories.reduce((sum, c) => sum + c.toolCount, 0)} tools</p>
                  </div>

                  {/* Categories Grid - 4 columns */}
                  <div className="p-4 grid grid-cols-4 gap-1">
                    {categories.map((category) => {
                      const Icon = iconMap[category.icon];
                      return (
                        <Link
                          key={category.id}
                          href={`/tools/${category.slug}`}
                          onClick={() => setIsCategoryOpen(false)}
                          className="group flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-all text-center cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
                            {Icon && <Icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />}
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {category.toolCount} tools
                          </span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <Link
                      href="/tools"
                      onClick={() => setIsCategoryOpen(false)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      View all tools
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Arrow */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45"></div>
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block w-56">
            <SearchBar />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
            <div className="mb-4">
              <SearchBar />
            </div>
            <nav className="space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Code className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">Home</span>
              </Link>

              {/* Mobile Categories */}
              <div className="pt-2 pb-1">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</p>
              </div>
              {categories.map((category) => {
                const Icon = iconMap[category.icon];
                return (
                  <Link
                    key={category.id}
                    href={`/tools/${category.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      {Icon && <Icon className="w-4 h-4 text-gray-600" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{category.toolCount}</span>
                    </div>
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
