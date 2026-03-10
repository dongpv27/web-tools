import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Love Web Tools',
  description: 'Privacy Policy for Love Web Tools. Learn how we protect your privacy and handle data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-gray-600">Last updated: March 10, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to Love Web Tools (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy
              and ensuring you have a positive experience when using our website and online tools.
              This Privacy Policy explains how we collect, use, and protect information when you
              visit our website at lovewebtools.com (the &quot;Service&quot;).
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our Service, you agree to the collection and use of information in accordance
              with this Privacy Policy. If you do not agree with any part of this policy, please
              discontinue use of our Service immediately.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1 Data You Process</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>We do not collect, store, or have access to any data you process using our tools.</strong>
              All file conversions, text formatting, image processing, and other operations are performed
              entirely within your web browser (client-side processing). Your data never leaves your device
              and is never transmitted to our servers.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2 Server Logs</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our web hosting provider may automatically collect and store certain technical information
              in server logs when you visit our website. This may include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>IP address (anonymized where possible)</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring website</li>
              <li>Pages visited and time of visit</li>
              <li>Date and time of visit</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              This information is used solely for website security, troubleshooting, and performance
              optimization. We do not use this data for marketing or tracking purposes.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.3 Information You Provide</h3>
            <p className="text-gray-600 leading-relaxed">
              If you choose to contact us via email or through any contact forms, we will collect the
              information you provide, such as your name, email address, and message content.
            </p>
          </section>

          {/* How We Use Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Server log information may be used for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>To maintain website security and prevent malicious attacks</li>
              <li>To diagnose and fix technical issues</li>
              <li>To monitor and improve website performance</li>
              <li>To ensure the Service operates correctly</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              We do not sell, rent, or share your information with third parties for marketing purposes.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Currently, our Service does not use cookies or any tracking technologies. We do not
              set any cookies on your device when you visit or use our website.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              However, please note that:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Your web browser may store certain data locally (cache, local storage) for performance purposes</li>
              <li>If we add cookies in the future, we will update this Privacy Policy and provide appropriate notice</li>
              <li>You can manage browser data through your browser settings at any time</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Currently, we do not use any third-party analytics, advertising, or tracking services
              on our website. Our Service operates independently without integrating external services
              that would collect your data.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may use the following in the future:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Content Delivery Network (CDN):</strong> To deliver content faster, which may log basic technical information</li>
              <li><strong>Analytics Services:</strong> To understand website usage (we will update this policy if implemented)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              If we add any third-party services in the future, we will update this Privacy Policy
              to reflect those changes and provide appropriate disclosure.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect the
              automatically collected information against unauthorized access, alteration,
              disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>HTTPS encryption for all data transmission</li>
              <li>Regular security assessments and updates</li>
              <li>Secure server infrastructure</li>
              <li>Access controls and authentication measures</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              However, no method of transmission over the Internet or electronic storage is
              100% secure. While we strive to use commercially acceptable means to protect
              your information, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal
              information, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Right to Access:</strong> Request information about the personal data we hold about you</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restriction:</strong> Request limitation of processing your data</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Right to Object:</strong> Object to certain types of processing</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              To exercise any of these rights, please contact us using the information provided
              below. We will respond to your request within a reasonable timeframe and in accordance
              with applicable laws.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our Service is not intended for children under the age of 13 (or 16 in certain
              jurisdictions). We do not knowingly collect personal information from children.
              If you are a parent or guardian and believe that your child has provided us with
              personal information, please contact us immediately, and we will take steps to
              delete such information.
            </p>
          </section>

          {/* International Users */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website may be accessed from various countries around the world. If you are
              accessing our Service from outside the country where our servers are located,
              please be aware that your information may be transferred to, stored, and processed
              in a different jurisdiction. By using our Service, you consent to such transfers.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our
              practices, technologies, legal requirements, or other factors. We will post the
              updated Privacy Policy on this page with a new &quot;Last updated&quot; date. We encourage
              you to review this Privacy Policy periodically to stay informed about how we
              protect your information.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy
              or our privacy practices, please contact us at:
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
