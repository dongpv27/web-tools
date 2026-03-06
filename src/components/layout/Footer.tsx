import Link from 'next/link';
import { Code, Github, Twitter, Mail } from 'lucide-react';
import { categories } from '@/lib/categories';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <Code className="w-6 h-6 text-blue-500" />
              <span>WebTools</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Free online tools for developers, designers, and everyone. 100% client-side processing for your privacy.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 4).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/tools/${category.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">More Tools</h3>
            <ul className="space-y-2">
              {categories.slice(4).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/tools/${category.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tools/dev/json-formatter"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/dev/base64-encode"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Base64 Encoder
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/text/word-counter"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Word Counter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/color/color-picker"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Color Picker
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} WebTools. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
              About
            </Link>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
