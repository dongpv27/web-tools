import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - Love Web Tools',
  description: 'Terms of Service for Love Web Tools. Read our terms and conditions for using our free online tools.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-gray-600">Last updated: March 10, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to Love Web Tools. By accessing or using our website at lovewebtools.com and
              all associated tools and services (collectively, the &quot;Service&quot;), you agree to be bound
              by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not
              use our Service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              These Terms constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or
              &quot;your&quot;) and Love Web Tools (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) governing your use of
              the Service.
            </p>
          </section>

          {/* Description of Service */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Love Web Tools provides free online tools for various purposes, including but not
              limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Developer tools (JSON formatting, encoding/decoding, etc.)</li>
              <li>Text processing and conversion tools</li>
              <li>Image conversion, resizing, and optimization</li>
              <li>Color tools and gradient generators</li>
              <li>Unit and number converters</li>
              <li>YouTube thumbnail downloaders</li>
              <li>Office and document processing tools</li>
              <li>Other miscellaneous utilities</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              All tools are provided free of charge and operate entirely within your web browser
              (client-side processing), meaning your data is not transmitted to our servers.
            </p>
          </section>

          {/* User Responsibilities */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              By using our Service, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
              <li>Not attempt to interfere with, disrupt, or impair the Service</li>
              <li>Not attempt to gain unauthorized access to any part of the Service</li>
              <li>Not use automated systems (bots, scrapers) to access the Service without permission</li>
              <li>Not use the Service to process or generate illegal, harmful, or malicious content</li>
              <li>Not attempt to reverse engineer or derive source code from the Service</li>
              <li>Comply with all applicable local, state, national, and international laws</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property Rights</h2>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">4.1 Our Property</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Service, including its original content, features, functionality, design, layout,
              logos, graphics, and all other elements, is owned by Love Web Tools and is protected
              by international copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">4.2 Limited License</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We grant you a limited, non-exclusive, non-transferable, revocable license to access
              and use the Service for personal, non-commercial purposes, subject to these Terms.
              This license does not include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>The right to modify, copy, distribute, or create derivative works</li>
              <li>The right to use the Service for commercial purposes without permission</li>
              <li>The right to sublicense or transfer your access rights</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.3 Your Content</h3>
            <p className="text-gray-600 leading-relaxed">
              You retain all rights to the content you process using our tools. Since all processing
              occurs locally in your browser, we do not access, store, or claim any rights to your
              content. You are solely responsible for ensuring you have the right to process any
              content you submit to our tools.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
              WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Implied warranties of merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Accuracy or reliability of results</li>
              <li>Uninterrupted or error-free operation</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              We do not warrant that the Service will meet your specific requirements, that it will
              be secure, timely, or error-free, or that the results obtained from using the Service
              will be accurate or reliable. You use the Service at your own risk.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, LOVE WEB TOOLS AND ITS OWNERS,
              EMPLOYEES, AFFILIATES, AND PARTNERS SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Any direct, indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
              <li>Damages resulting from use or inability to use the Service</li>
              <li>Damages resulting from any errors or omissions in content</li>
              <li>Damages resulting from unauthorized access or alteration of your data</li>
              <li>Damages resulting from third-party conduct on the Service</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              This limitation applies regardless of the legal theory under which such damages are
              sought, and even if we have been advised of the possibility of such damages. Some
              jurisdictions do not allow the exclusion of certain warranties or limitations of
              liability, so some of the above may not apply to you.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to defend, indemnify, and hold harmless Love Web Tools and its owners,
              employees, affiliates, and partners from and against any claims, liabilities, damages,
              losses, and expenses, including reasonable attorney&apos;s fees, arising out of or in any
              way connected with:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you process through the Service</li>
            </ul>
          </section>

          {/* Service Modifications */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Service Modifications and Termination</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Modify, suspend, or discontinue any part of the Service at any time without notice</li>
              <li>Add or remove features and functionality</li>
              <li>Change pricing (though we currently intend to keep the Service free)</li>
              <li>Terminate or suspend your access to the Service for any reason</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              We shall not be liable to you or any third party for any modification, suspension,
              or discontinuation of the Service.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links and Services</h2>
            <p className="text-gray-600 leading-relaxed">
              The Service may contain links to third-party websites or services that are not owned
              or controlled by Love Web Tools. We have no control over, and assume no responsibility
              for, the content, privacy policies, or practices of any third-party websites or
              services. You acknowledge and agree that Love Web Tools shall not be responsible or
              liable, directly or indirectly, for any damage or loss caused or alleged to be caused
              by or in connection with the use of any such content, goods, or services available
              on or through any such websites or services.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law and Jurisdiction</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws,
              without regard to conflict of law principles. Any disputes arising from or relating
              to these Terms or the Service shall be resolved through good faith negotiations.
              If such negotiations fail, the dispute shall be submitted to the appropriate
              jurisdiction as determined by applicable law.
            </p>
          </section>

          {/* Severability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Severability</h2>
            <p className="text-gray-600 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid by a court
              of competent jurisdiction, that provision shall be limited or eliminated to the
              minimum extent necessary, and the remaining provisions shall remain in full force
              and effect.
            </p>
          </section>

          {/* Entire Agreement */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Entire Agreement</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between
              you and Love Web Tools regarding the use of the Service and supersede any prior
              agreements or understandings, whether written or oral.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective
              immediately upon posting on this page with an updated &quot;Last updated&quot; date. Your
              continued use of the Service after any changes constitutes acceptance of the new
              Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-800 font-semibold mb-2">Love Web Tools</p>
              <p className="text-gray-600">Email: contact@lovewebtools.com</p>
              <p className="text-gray-600">Website: lovewebtools.com</p>
            </div>
          </section>

          {/* Back Link */}
          <div className="pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
