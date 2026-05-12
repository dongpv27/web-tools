interface SeoContentProps {
  title: string;
  children: React.ReactNode;
}

function SeoSection({ title, children }: SeoContentProps) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="prose prose-gray max-w-none">
        {children}
      </div>
    </section>
  );
}

function SeoParagraph({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600 mb-4">{children}</p>;
}

function SeoList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

interface WhatIsProps {
  name: string;
  description: string;
}

function WhatIs({ name, description }: WhatIsProps) {
  return (
    <SeoSection title={`What is ${name}?`}>
      <SeoParagraph>{description}</SeoParagraph>
    </SeoSection>
  );
}

interface WhyUseProps {
  benefits: string[];
}

function WhyUse({ benefits }: WhyUseProps) {
  return (
    <SeoSection title="Why use this tool?">
      <SeoList items={benefits} />
    </SeoSection>
  );
}

interface HowToUseProps {
  steps: string[];
}

function HowToUse({ steps }: HowToUseProps) {
  return (
    <SeoSection title="How to use">
      <ol className="list-decimal list-inside text-gray-600 space-y-2">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </SeoSection>
  );
}

interface ExamplesProps {
  examples: { title: string; body: string }[];
}

function Examples({ examples }: ExamplesProps) {
  if (!examples.length) return null;
  return (
    <SeoSection title="Examples">
      <div className="space-y-4">
        {examples.map((ex, i) => (
          <div key={i} className="border-l-4 border-blue-200 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">{ex.title}</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{ex.body}</p>
          </div>
        ))}
      </div>
    </SeoSection>
  );
}

function UseCases({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <SeoSection title="Common use cases">
      <SeoList items={items} />
    </SeoSection>
  );
}

interface TroubleshootingProps {
  items: { problem: string; solution: string }[];
}

function Troubleshooting({ items }: TroubleshootingProps) {
  if (!items.length) return null;
  return (
    <SeoSection title="Troubleshooting">
      <dl className="space-y-3">
        {items.map((it, i) => (
          <div key={i}>
            <dt className="font-semibold text-gray-900">{it.problem}</dt>
            <dd className="text-gray-600 ml-0">{it.solution}</dd>
          </div>
        ))}
      </dl>
    </SeoSection>
  );
}

export const SeoContent = Object.assign(SeoSection, {
  Paragraph: SeoParagraph,
  List: SeoList,
  WhatIs,
  WhyUse,
  HowToUse,
  Examples,
  UseCases,
  Troubleshooting,
});
