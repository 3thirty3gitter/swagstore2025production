import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: 'FAQ - Custom Team Store Questions | SwagStore Canada',
  description: 'Answers to common questions about our free custom team stores, setup process, SwagBucks rewards, pricing, and merchandise options for teams, schools, and organizations.',
  keywords: [
    'team store faq',
    'custom apparel questions',
    'team merchandise help',
    'swagbucks rewards faq',
    'free team store setup',
    'how team stores work',
    'school spirit wear questions',
    'sports team apparel faq'
  ],
  openGraph: {
    title: 'FAQ - Custom Team Store Questions | SwagStore Canada',
    description: 'Get answers about our free team stores, rewards program, and custom merchandise.',
  }
};

const faqs = [
  {
    question: "Is the team store really free to set up?",
    answer: "Yes, absolutely! We build and manage your custom team store at no cost to you. There are no setup fees, no monthly fees, and no hidden charges. You earn SwagBucks rewards on every purchase made through your store."
  },
  {
    question: "How long does it take to get my store live?",
    answer: "Your custom team store launches in 24 hours or less. Simply fill out our store request form, and we'll handle everything - design, setup, product selection, and launch. You'll receive your unique subdomain (yourteam.swagstore.ca) within 24 hours."
  },
  {
    question: "What are SwagBucks and how do they work?",
    answer: "SwagBucks are rewards you earn on every purchase made through your team store. They accumulate automatically and can be redeemed for free merchandise, gift cards, or team equipment. It's our way of rewarding you for using SwagStore - the more your team buys, the more you earn!"
  },
  {
    question: "What types of products can I sell in my store?",
    answer: "We offer a wide range of custom merchandise including jerseys, hoodies, t-shirts, hats, jackets, water bottles, bags, and more. All products can be customized with your team logo, colors, and branding. We'll work with you to select the perfect products for your team, school, or organization."
  },
  {
    question: "Who can get a SwagStore team store?",
    answer: "Any team, school, club, or organization in Canada can get a free SwagStore! We serve sports teams (hockey, soccer, baseball, basketball, football, volleyball, etc.), schools and universities, dance studios, bands and choirs, clubs, non-profits, and community organizations."
  },
  {
    question: "Do I need to manage inventory or handle shipping?",
    answer: "No! We handle everything. There's no inventory to manage, no shipping to coordinate, and no orders to process. We manage the entire fulfillment process from production to delivery. Your only job is to share your store link with your team."
  },
  {
    question: "Can I customize my store's design and products?",
    answer: "Yes! We'll customize your store with your team colors, logo, and branding. You can choose which products to feature, set your own margins, and we'll make sure everything matches your team's identity perfectly."
  },
  {
    question: "How do team members make purchases?",
    answer: "Team members simply visit your custom store URL (yourteam.swagstore.ca), browse products, and checkout securely. They pay directly on the site, and we handle production and shipping. It's that simple!"
  },
  {
    question: "What if I need help or have questions?",
    answer: "We provide full support throughout the entire process. From initial setup to ongoing management, our team is here to help. You can reach out anytime with questions about your store, products, or SwagBucks rewards."
  },
  {
    question: "Can I use this for fundraising?",
    answer: "Absolutely! Many teams use SwagStore for fundraising. You can set custom margins on products, and the profits go directly to your organization. Plus, you earn SwagBucks on top of those margins. It's a win-win for your team!"
  },
  {
    question: "Is there a minimum order quantity?",
    answer: "No minimum orders required! Team members can order as little or as much as they want. We handle individual orders, so there's no need to coordinate bulk purchases or collect sizes from everyone."
  },
  {
    question: "What areas do you serve?",
    answer: "We proudly serve teams, schools, and organizations across Canada. From British Columbia to Newfoundland, we provide custom team stores and ship merchandise nationwide."
  }
];

export default function FAQPage() {
  // Generate FAQ Schema.org structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our free custom team stores, SwagBucks rewards, and how we help teams, schools, and organizations across Canada.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg border border-gray-200 px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Ready to get your free team store? Request your store today and we'll have you live in 24 hours.
            </p>
            <a
              href="/request-store"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Request Your Free Store
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
