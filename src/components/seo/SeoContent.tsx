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

export const SeoContent = Object.assign(SeoSection, {
  Paragraph: SeoParagraph,
  List: SeoList,
  WhatIs,
  WhyUse,
  HowToUse,
});
