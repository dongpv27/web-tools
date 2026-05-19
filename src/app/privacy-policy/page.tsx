import { Metadata } from 'next';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import Breadcrumb from '@/components/layout/Breadcrumb';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Love Web Tools handles your data — short version: everything runs in your browser, we never see your content. Read the full Privacy Policy.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-gray-600">Last updated: May 19, 2026</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Similar Technologies</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A cookie is a small text file stored on your device by your web browser. Our Service
              uses cookies and similar technologies (such as the browser&apos;s local storage) for the
              purposes described below. Some are set by us directly; others are set by trusted
              third parties such as Google.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">4.1 Strictly Necessary (set by us)</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We store a small amount of data in your browser&apos;s <strong>local storage</strong>{' '}
              (not a cookie) to remember which tools you have recently used, so they can appear in
              the &quot;Recently Used&quot; sidebar. This information stays on your device and is never
              transmitted to our servers. You can clear it at any time through your browser&apos;s
              site-data settings.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">4.2 Analytics Cookies (Google Analytics 4)</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use Google Analytics 4 (GA4) to understand aggregate usage of the Service —
              which pages are visited, where visitors come from, and how the site performs on
              different devices. GA4 sets cookies (typically named <code>_ga</code> and
              <code>_ga_*</code>) that include a randomly-generated client identifier. We have
              enabled IP anonymisation, which truncates IP addresses before any storage.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Google may also use this data in accordance with the{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 hover:underline"
              >
                Google Privacy Policy
              </a>
              . You can opt out of Google Analytics by installing the{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 hover:underline"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">4.3 Advertising Cookies (Google AdSense)</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may display ads served by Google AdSense or other third-party advertising
              partners. These partners use cookies (including the{' '}
              <strong>DoubleClick DART cookie</strong>) to serve ads based on visits to our
              Service and other sites on the internet. The DART cookie enables Google and its
              partners to show ads based on your prior visits.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              You can opt out of personalised advertising by Google by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 hover:underline"
              >
                Google Ads Settings
              </a>
              . You can also opt out of third-party vendor use of cookies for personalised
              advertising via{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 hover:underline"
              >
                aboutads.info
              </a>
              {' '}or{' '}
              <a
                href="https://www.youronlinechoices.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 hover:underline"
              >
                youronlinechoices.eu
              </a>{' '}
              (for users in the EU).
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              For more details on how Google uses information from sites that use its services,
              see{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 hover:underline"
              >
                How Google uses information from sites or apps that use our services
              </a>
              .
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">4.4 Managing Cookies</h3>
            <p className="text-gray-600 leading-relaxed">
              Most browsers let you refuse, accept, or delete cookies through their settings.
              Blocking strictly necessary cookies may prevent parts of the Service from working
              correctly. For instructions tailored to your browser, see your browser&apos;s help
              documentation (Chrome, Firefox, Safari, Edge, etc.).
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We rely on a small number of third-party services to operate and improve the
              Service. These vendors may receive limited technical information (such as IP
              address and User-Agent) necessary to perform their function. None of the data you
              process inside the tools themselves (text, images, files) is ever shared with any
              third party — that data never leaves your browser.
            </p>

            <ul className="list-disc list-inside text-gray-600 space-y-3 ml-4">
              <li>
                <strong>Vercel</strong> — our hosting provider. Receives standard HTTP request
                metadata (IP, headers) to deliver pages. See{' '}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 hover:underline"
                >
                  Vercel Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>Cloudflare</strong> — content delivery network and security layer.
                Receives request metadata to cache content and block malicious traffic. See{' '}
                <a
                  href="https://www.cloudflare.com/privacypolicy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 hover:underline"
                >
                  Cloudflare Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>Google Analytics 4</strong> — measures aggregate, anonymised usage. See
                Section 4.2 above and the{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 hover:underline"
                >
                  Google Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>Google AdSense and partner ad networks</strong> — when ads are enabled,
                Google and its partners may serve ads on the Service. See Section 4.3 above.
              </li>
              <li>
                <strong>Public CDNs (jsDelivr, fonts)</strong> — we load a small number of
                public assets (fonts for PDF generation, certain libraries) from public CDNs.
                These services may log standard request metadata.
              </li>
            </ul>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children&apos;s Privacy (COPPA)</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our Service is not directed to children under the age of 13 (or 16 in certain
              EU jurisdictions), and we do not knowingly collect personal information from
              children. In compliance with the Children&apos;s Online Privacy Protection Act
              (COPPA) and similar regulations:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>We do not knowingly target advertising at children</li>
              <li>We do not knowingly create user profiles based on children&apos;s activity</li>
              <li>If we become aware that we have collected personal information from a child
                  under 13 without verifiable parental consent, we will delete it promptly</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              If you are a parent or guardian and believe that your child has provided us with
              personal information, please contact us at <strong>contact@lovewebtools.com</strong>{' '}
              and we will take steps to remove that information.
            </p>
          </section>

          {/* International Users / GDPR / CCPA */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Users, GDPR, and CCPA</h2>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">9.1 International Data Transfers</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our Service is hosted on Vercel&apos;s global edge network and routed through
              Cloudflare. By using the Service, you understand that limited technical
              information (such as IP address and request metadata) may be processed in any
              country where our service providers operate, including the United States.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">9.2 European Economic Area (GDPR)</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you are in the European Economic Area (EEA), United Kingdom, or Switzerland,
              you have the rights described in Section 7 above (access, rectification, erasure,
              restriction, portability, objection) under the General Data Protection Regulation
              (GDPR). Our legal basis for processing the limited data we collect is{' '}
              <strong>legitimate interest</strong> in operating, securing, and improving the
              Service, and your <strong>consent</strong> where applicable (e.g. analytics and
              advertising cookies).
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              You can withdraw consent at any time by clearing your cookies and using the
              opt-out links in Sections 4.2 and 4.3. To exercise any GDPR right, contact us at
              <strong> contact@lovewebtools.com</strong>.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">9.3 California Residents (CCPA / CPRA)</h3>
            <p className="text-gray-600 leading-relaxed">
              If you are a California resident, the California Consumer Privacy Act (CCPA) and
              its amendments give you rights to know what personal information is collected,
              the right to delete it, and the right to opt out of any sale of personal
              information. <strong>We do not sell personal information.</strong> To exercise
              any CCPA right, contact us at <strong>contact@lovewebtools.com</strong>.
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
              <p className="text-gray-600">
                Email:{' '}
                <a href="mailto:contact@lovewebtools.com" className="text-cyan-600 hover:underline">
                  contact@lovewebtools.com
                </a>
              </p>
              <p className="text-gray-600">
                Website:{' '}
                <a href="https://lovewebtools.com" className="text-cyan-600 hover:underline">
                  lovewebtools.com
                </a>
              </p>
              <p className="text-gray-600 mt-2">
                Or use our{' '}
                <Link href="/contact" className="text-cyan-600 hover:underline">
                  Contact page
                </Link>{' '}
                for general inquiries.
              </p>
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
    </MainLayout>
  );
}
