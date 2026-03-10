import { Metadata } from 'next';
import TechHeartLogo from '@/components/ui/TechHeartLogo';

export const metadata: Metadata = {
  title: 'About Us - Love Web Tools',
  description: 'Learn about Love Web Tools - free online tools for developers, designers, and everyone. 100% client-side processing for your privacy.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <TechHeartLogo size={64} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Love Web Tools</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Free online tools for developers, designers, and everyone who loves the web.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Mission */}
          <section className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              At Love Web Tools, we believe that powerful tools should be accessible to everyone. Our mission is to provide
              high-quality, free online tools that help developers, designers, and everyday users work more efficiently
              without compromising on privacy or security.
            </p>
          </section>

          {/* What Makes Us Different */}
          <section className="p-8 border-b border-gray-100 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">100% Client-Side Processing</h3>
                  <p className="text-gray-600 text-sm">All tools run directly in your browser. Your data never leaves your device.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Completely Free</h3>
                  <p className="text-gray-600 text-sm">No subscriptions, no hidden fees, no premium tiers. All tools are free to use.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Fast & Reliable</h3>
                  <p className="text-gray-600 text-sm">Optimized for speed with no server round-trips. Get results instantly.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Works Everywhere</h3>
                  <p className="text-gray-600 text-sm">Use our tools on any device with a modern web browser, anywhere in the world.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Tools */}
          <section className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Tools</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We offer a comprehensive suite of online tools across multiple categories:
            </p>
            <ul className="grid md:grid-cols-2 gap-3 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                Developer Tools (JSON, Base64, Encoding)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                Text Tools (Formatters, Converters)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                Image Tools (Resize, Convert, Compress)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                YouTube Tools (Thumbnail Downloader)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                Color Tools (Pickers, Gradients)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                Converters (Units, Numbers)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                Office Tools (PDF, Document processing)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                And many more...
              </li>
            </ul>
          </section>

          {/* Privacy First */}
          <section className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy First</h2>
            <p className="text-gray-600 leading-relaxed">
              Your privacy is our top priority. Since all processing happens locally in your browser,
              we never see, store, or have access to any data you process using our tools. Whether you&apos;re
              formatting JSON, converting images, or encoding text, your data stays with you.
            </p>
          </section>
        </div>

        {/* Contact */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Have questions or suggestions? We&apos;d love to hear from you.
          </p>
          <a
            href="mailto:contact@lovewebtools.com"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg transition-shadow"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
