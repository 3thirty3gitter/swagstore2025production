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
        These Terms and Conditions govern your access to and use of the SwagStore platform and related services operated by 3Thirty3 Ltd. o/a SwagStore ("SwagStore", "we", "us", "our"). By accessing or using our website or services you agree to these Terms. If you do not agree, do not use the Services.
      </p>

      <h2>Who We Are</h2>
      <p>
        SwagStore is operated by 3Thirty3 Ltd. o/a SwagStore. Our contact for legal and compliance matters is legal@swagstore.ca and our registered address is 5415 Calgary Trail NW, Edmonton, AB T6H 4J9, Canada.
      </p>

      <h2>Platform Role and Operational Control</h2>
      <p>
        SwagStore provides an e‑commerce platform and tooling to help teams create and manage storefronts. SwagStore retains ultimate operational control over the platform, including the operation of storefronts, acceptance of orders, pricing, fulfillment arrangements, platform policies, and suspension or termination of access. Teams (sometimes referred to as "Tenants" or "Sellers") may propose product listings, provide artwork, and supply content, but a team’s ability to list products, set prices, or otherwise make changes that affect buyers is subject to SwagStore’s approval and platform rules. No team may independently represent that it controls the operation of the platform, bind SwagStore to contracts, or act on behalf of SwagStore except where SwagStore has expressly provided written authorization.
      </p>

      <h2>Accounts, Eligibility and Verification</h2>
      <p>
        Teams must provide accurate information during onboarding and be legally capable of entering into contracts in Canada. SwagStore may require verification and may approve or reject storefront requests at its discretion to meet legal, compliance, or fraud‑prevention obligations.
      </p>

      <h2>Orders, Pricing, and Fulfillment</h2>
      <ul>
        <li>Orders placed by buyers are offers to purchase and are subject to acceptance by SwagStore in accordance with these Terms.</li>
        <li>Prices are quoted in CAD and may exclude taxes and shipping unless stated otherwise.</li>
        <li>SwagStore controls fulfillment relationships and shipping terms. Estimated delivery times are provided for convenience and do not form part of a binding promise unless required by law.</li>
      </ul>

      <h2>Returns and Refunds</h2>
      <p>
        Return, refund, and cancellation policies applicable to an order are disclosed at checkout and in applicable policy pages. Certain items (for example, custom or personalised goods) may be final sale as permitted by law. These Terms do not limit mandatory consumer protections under Canadian law.
      </p>

      <h2>SwagBucks and Platform Credits</h2>
      <p>
        Any platform credits or reward balances ("SwagBucks") are non‑cash credits issued and administered by SwagStore under the rules we publish. They have no cash value and may be withheld, adjusted or revoked by SwagStore in cases of misuse, error or fraud.
      </p>

      <h2>Content, Listings, and Intellectual Property</h2>
      <p>
        Teams are responsible for the accuracy and legality of content they submit. Teams retain ownership of content they upload but grant SwagStore a licence to host, reproduce, and display that content as necessary to provide the Services. SwagStore may remove or refuse content that violates IP rights, law, or these Terms.
      </p>

      <h2>Compliance and Acceptable Use</h2>
      <p>
        Use of the Services must comply with applicable laws, including consumer protection, product safety, and advertising rules. Prohibited conduct includes listing unlawful or unsafe products, infringing IP, engaging in deceptive practices, or attempting to circumvent technical controls.
      </p>

      <h2>Privacy and Data</h2>
      <p>
        Our Privacy Policy explains how we collect, use, and share personal information. Teams and buyers must comply with data protection obligations and provide information required for reporting or regulatory compliance.
      </p>

      <h2>Suspension, Termination and Enforcement</h2>
      <p>
        SwagStore may suspend or terminate access to the Services for conduct that violates these Terms, suggests fraud, violates law, or otherwise threatens safety or platform integrity. We may take enforcement actions including withholding payments, removing listings, and pursuing legal remedies.
      </p>

      <h2>Warranties and Disclaimers</h2>
      <p>
        The Services are provided "as is" and "as available" to the fullest extent permitted by law. To the extent permitted, SwagStore disclaims all warranties, whether express or implied.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        Except where prohibited by law, SwagStore’s liability to you for any claim arising from these Terms is limited to the greater of (a) amounts paid by the team to SwagStore in the 12 months preceding the event giving rise to liability, or (b) CAD $1,000. We are not liable for indirect, special, or consequential damages to the extent allowed by law.
      </p>

      <h2>Indemnification</h2>
      <p>
        Teams agree to indemnify and hold harmless SwagStore from claims arising out of their content, listings, breach of these Terms, violations of applicable law, or infringement of third‑party rights.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        SwagStore may change these Terms or modify the Services. Material changes will be posted with reasonable notice where practicable. Continued use after changes constitutes acceptance.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms are governed by the laws of the Province of Alberta and the federal laws of Canada applicable therein. Courts located in Edmonton, Alberta have exclusive jurisdiction, except where mandatory consumer protections provide otherwise.
      </p>

      <h2>Severability and Entire Agreement</h2>
      <p>
        If any provision of these Terms is found unenforceable, the remaining provisions remain in full force. These Terms, together with any policies referenced herein, constitute the entire agreement between you and SwagStore regarding the Services.
      </p>

      <h2>Contact</h2>
      <p>
        Legal and compliance: legal@swagstore.ca<br />
        Address: 3Thirty3 Ltd. o/a SwagStore, 5415 Calgary Trail NW, Edmonton, AB T6H 4J9, Canada
      </p>
    </main>
  )
}
