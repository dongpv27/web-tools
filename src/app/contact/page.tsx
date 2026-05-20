import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Mail, MessageSquare, Bug, Lightbulb } from 'lucide-react';
import ContactForm from '@/components/contact/ContactForm';

const CONTACT_EMAIL = 'contact@lovewebtools.com';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Love Web Tools team. Send feedback, report a bug, suggest a new tool, or ask anything — we read every message.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Love Web Tools',
    description:
      'Reach out with feedback, bug reports, or feature requests. We read every message.',
    type: 'website',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <MainLayout>
      <Breadcrumb items={[{ label: 'Contact' }]} />

      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Contact{' '}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Love Web Tools
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Questions, feedback, bug reports, or just want to say hi? We read every message
            and reply within 2-3 business days.
          </p>
        </header>

        {/* Contact form — primary submission channel */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Send us a message</h2>
          <ContactForm />
        </section>

        {/* Direct email fallback */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-10">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700">
                Prefer email directly?{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Same destination as the form above — pick whichever is more convenient.
              </p>
            </div>
          </div>
        </section>

        {/* What to write about */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">What can we help with?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Bug className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-gray-900">Bug reports</h3>
              </div>
              <p className="text-sm text-gray-600">
                Tool behaving unexpectedly? Include the tool name, browser, and steps to
                reproduce. Screenshots help.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900">Tool requests</h3>
              </div>
              <p className="text-sm text-gray-600">
                Have a workflow that needs a dedicated tool? Tell us the use case — we
                prioritise tools with real demand.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">General feedback</h3>
              </div>
              <p className="text-sm text-gray-600">
                Likes, dislikes, suggestions, or stories about how you use the tools — all
                welcome.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-gray-900">Privacy / data requests</h3>
              </div>
              <p className="text-sm text-gray-600">
                Although we don&apos;t collect personal data through the tools, you can still
                reach us with privacy or compliance questions.
              </p>
            </div>
          </div>
        </section>

        {/* Before you write */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Before you write</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              ✓ Check the{' '}
              <a href="/about" className="text-blue-600 hover:underline">
                About page
              </a>{' '}
              for what we do and how the tools work.
            </li>
            <li>
              ✓ Check the{' '}
              <a href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>{' '}
              for data handling questions.
            </li>
            <li>
              ✓ Check the{' '}
              <a href="/blog" className="text-blue-600 hover:underline">
                Blog
              </a>{' '}
              for tutorials and deep-dives on common tasks.
            </li>
            <li>
              ✓ Browse{' '}
              <a href="/tools" className="text-blue-600 hover:underline">
                all 178+ tools
              </a>{' '}
              — your request may already be covered.
            </li>
          </ul>
        </section>

        {/* Response time + scope */}
        <section className="prose prose-sm max-w-none text-gray-600">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Response expectations</h2>
          <p>
            We&apos;re a small team building these tools as a side project. We aim to reply
            within 2-3 business days, but during heavy weeks (large updates, holidays) it
            can take up to a week. Critical bug reports — tools producing broken output,
            crashes, security issues — are triaged first.
          </p>
          <p>
            We do not provide:
          </p>
          <ul>
            <li>Custom development services or paid one-on-one support</li>
            <li>Bulk data conversions on your behalf (you can use the tools directly)</li>
            <li>API access (all tools are browser-only by design)</li>
            <li>Refunds (the service is free — there is nothing to refund)</li>
          </ul>
          <p>
            For everything else, drop us a line. Thanks for using Love Web Tools.
          </p>
        </section>
      </div>
    </MainLayout>
  );
}
