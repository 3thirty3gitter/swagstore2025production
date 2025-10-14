import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions | SwagStore',
  description: 'Terms and Conditions for 3Thirty3 Ltd. o/a SwagStore',
}

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-12 prose prose-neutral max-w-4xl">
      <h1 className="font-headline">Terms and Conditions</h1>
      <p>
        By accessing or using SwagStore’s website and services, including storefront creation, administration tools, and related functionality, you agree to these Terms and Conditions. If you do not agree, do not use the services. These Terms constitute a binding agreement between you and 3Thirty3 Ltd. o/a SwagStore and incorporate applicable Canadian e‑commerce, consumer protection, privacy, and digital platform requirements.
      </p>

      <h2>Legal Entity and Contact</h2>
      <ul>
        <li>Legal entity: 3Thirty3 Ltd. o/a SwagStore</li>
        <li>Registered address: 5415 Calgary Trail NW, Edmonton, AB T6H 4J9, Canada</li>
        <li>Legal and compliance: legal@swagstore.ca</li>
      </ul>

      <h2>Definitions</h2>
      <ul>
        <li>“SwagStore,” “we,” “us,” or “our” means 3Thirty3 Ltd. o/a SwagStore, operator of the platform at swagstore.ca providing team storefronts.</li>
        <li>“Team,” “Tenant,” or “Seller” means a Canadian team, club, school, or organization that applies for and, upon approval, operates a storefront.</li>
        <li>“Supporter,” “Buyer,” or “Customer” means an individual purchasing merchandise from a team storefront.</li>
        <li>“SwagBucks” means platform reward credits accrued by a team based on eligible purchases, subject to these Terms.</li>
        <li>“Services” means the site, storefronts, APIs, admin tools, content hosting, and related features offered by SwagStore.</li>
      </ul>

      <h2>Eligibility and Account Registration</h2>
      <p>
        Teams must be legally capable of entering contracts in Canada and provide accurate organizational and contact details during onboarding. SwagStore may approve or reject storefront requests at its sole discretion and may require additional verification to comply with consumer protection, platform reporting, and fraud prevention obligations.
      </p>

      <h2>Marketplace Role and Responsibilities</h2>
      <p>
        SwagStore provides storefront tooling. Teams are responsible for accurate listings, pricing, availability, tax applicability, and compliance with applicable provincial consumer protection statutes. SwagStore may review or moderate listings, communications, and content for compliance.
      </p>

      <h2>Ordering, Pricing, Taxes, and Fulfillment</h2>
      <ul>
        <li>Orders are offers to purchase and may be accepted or declined.</li>
        <li>Prices are in CAD and may exclude applicable taxes and shipping.</li>
        <li>Shipping timelines are estimates; risk of loss transfers on carrier handoff unless otherwise required by law.</li>
      </ul>

      <h2>Returns, Refunds, and Cancellations</h2>
      <p>
        Return and refund eligibility, timelines, and processes are disclosed at checkout or policy pages. Certain categories (e.g., customized items) may be final sale as permitted by law. Nothing limits statutory consumer rights.
      </p>

      <h2>SwagBucks Rewards</h2>
      <ul>
        <li>Accrue based on eligible purchases, net of cancellations and returns.</li>
        <li>Not legal tender, no cash value, non-transferable, subject to adjustment for abuse or error.</li>
      </ul>

      <h2>Acceptable Use</h2>
      <p>
        No unlawful, unsafe, mislabelled products, infringing content, deceptive advertising, fake reviews, or attempts to circumvent technical controls.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        SwagStore owns platform IP; teams own their logos and content. Each party grants a limited license solely to operate storefronts and provide the Services. You warrant you have necessary rights to content uploaded.
      </p>

      <h2>Privacy and Data Protection</h2>
      <p>
        SwagStore complies with PIPEDA and applicable provincial privacy laws. A separate Privacy Policy details practices and user rights, including access and correction.
      </p>

      <h2>Commercial Electronic Messages (CASL)</h2>
      <p>
        Marketing communications require valid consent, sender identification, and a functional unsubscribe mechanism. Teams must maintain consent records.
      </p>

      <h2>Accessibility</h2>
      <p>
        Services strive to be accessible and inclusive for persons with disabilities. Contact us for accommodations.
      </p>

      <h2>Competition and Advertising Standards</h2>
      <p>
        Advertising must be truthful and not misleading. Material connections with affiliates or influencers must be disclosed.
      </p>

      <h2>Platform Reporting Rules (CRA)</h2>
      <p>
        If applicable, SwagStore may be required to collect, verify, and report certain seller information under CRA digital platform reporting rules. Teams agree to provide required information.
      </p>

      <h2>Suspension and Termination</h2>
      <p>
        SwagStore may suspend or terminate access for violations of these Terms, suspected fraud, IP infringement, safety risks, or regulatory non-compliance.
      </p>

      <h2>Warranties and Disclaimers</h2>
      <p>
        Services are provided “as is” and “as available,” to the maximum extent permitted by law. This does not limit non-excludable statutory rights.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, SwagStore’s total liability shall not exceed the greater of: (a) amounts paid by the team to SwagStore in the 12 months preceding the event; or (b) CAD $1,000. No liability for indirect or consequential damages, except where prohibited.
      </p>

      <h2>Indemnification</h2>
      <p>
        Teams agree to indemnify SwagStore against claims arising from listings, goods, content, breach of Terms, violations of law, or IP infringement related to team content.
      </p>

      <h2>Electronic Transactions and Signatures</h2>
      <p>
        Teams consent to electronic contracting, notices, and record retention as permitted by Canadian e‑commerce statutes.
      </p>

      <h2>Changes to Services or Terms</h2>
      <p>
        SwagStore may modify the Services or these Terms. Material changes will be posted with reasonable notice where feasible.
      </p>

      <h2>Governing Law and Dispute Resolution</h2>
      <p>
        Governing law: Alberta and applicable federal law. Courts in Edmonton, Alberta have exclusive jurisdiction, subject to non-excludable consumer venue rights.
      </p>

      <h2>Severability and Entire Agreement</h2>
      <p>
        If any provision is unenforceable, the remainder remains in effect. These Terms constitute the entire agreement regarding the Services.
      </p>

      <h2>Contact</h2>
      <p>
        SwagStore Legal: legal@swagstore.ca<br />
        Address: 3Thirty3 Ltd. o/a SwagStore, 5415 Calgary Trail NW, Edmonton, AB T6H 4J9, Canada
      </p>
    </main>
  )
}
