import StrategicAnswerTemplate from "@/components/StrategicAnswerTemplate";

const InstalledLeadershipModel = () => {
  return (
    <StrategicAnswerTemplate
      slug="installed-leadership-model"
      headline="What Is Installed Leadership?"
      description="Installed leadership means embedding strategic decision-making capacity inside the business — not advising from the outside. Here's what it means and why it matters for growth."
      datePublished="2026-02-13"
      dateModified="2026-02-13"
      topics={["installed leadership", "fractional executive", "growth architecture", "organizational design"]}
      intent="informational"
      summaryText="Installed leadership is the difference between advice and authority. It means embedding strategic decision-making capacity inside the organization — with the access, context, and accountability to make those decisions stick. Advisory tells you what to do. Installed leadership does it with you, inside the system, with skin in the outcome."
      sections={[
        {
          title: "The Advisory Problem",
          content: (
            <>
              <p className="mb-4">Most strategic engagements are advisory.</p>
              <p className="mb-4">An expert reviews your situation. They produce a recommendation. They deliver a deck. They leave.</p>
              <p className="mb-4">The deck sits in a shared drive. Some recommendations get implemented. Most don't. The ones that do get implemented are often distorted by the team's interpretation of what the advisor meant.</p>
              <p className="mb-4">Six months later, the company hires another advisor.</p>
              <p>This is the advisory cycle. It produces insight without change.</p>
            </>
          ),
        },
        {
          title: "What Installed Means",
          content: (
            <>
              <p className="mb-4">Installed leadership operates differently in five specific ways:</p>
              <h3 className="text-lg font-medium text-foreground mb-3">Direct Access</h3>
              <p className="mb-6 text-muted-foreground">The leader has direct access to the founder and key stakeholders. No account manager in between. No filtered information. Real context, real-time.</p>
              <h3 className="text-lg font-medium text-foreground mb-3">Decision Authority</h3>
              <p className="mb-6 text-muted-foreground">The leader can make strategic decisions — not just recommend them. This means authority over positioning, messaging, vendor relationships, and resource allocation within their domain.</p>
              <h3 className="text-lg font-medium text-foreground mb-3">Team Integration</h3>
              <p className="mb-6 text-muted-foreground">The leader works with internal teams, not above them. They attend the meetings. They see the data. They understand the politics. Context is not something they receive in a monthly briefing — it's something they live in.</p>
              <h3 className="text-lg font-medium text-foreground mb-3">System Ownership</h3>
              <p className="mb-6 text-muted-foreground">The leader doesn't just design systems — they install them. They build the GTM architecture, the messaging framework, the feedback loops. And they stay long enough to see whether they work.</p>
              <h3 className="text-lg font-medium text-foreground mb-3">Accountable Exit</h3>
              <p className="text-muted-foreground">The engagement has a defined arc: diagnose, architect, install, steward, transition. The leader builds toward their own departure — ensuring the organization can sustain what was built without ongoing dependency.</p>
            </>
          ),
        },
        {
          title: "Why It Matters More Than Expertise",
          content: (
            <>
              <p className="mb-4">Expertise is necessary but insufficient.</p>
              <p className="mb-4">Every company that hires a consultant gets expertise. Very few get change.</p>
              <p className="mb-4">The gap between expertise and change is installation. It's the difference between knowing what to do and having the organizational position to do it.</p>
              <p className="mb-4">A brilliant strategy that nobody executes is just a document.</p>
              <p>Installed leadership closes the gap between strategy and execution by placing the strategist inside the system.</p>
            </>
          ),
        },
        {
          title: "The Fractional Model as Installation Vehicle",
          content: (
            <>
              <p className="mb-4">The fractional executive model — particularly the fractional CMO — is designed for installation.</p>
              <p className="mb-4">It provides:</p>
              <ul className="list-none space-y-1 mb-4 text-muted-foreground">
                <li>Executive-level capability without full-time cost</li>
                <li>Enough hours for real integration, not just check-ins</li>
                <li>A defined engagement arc with measurable milestones</li>
                <li>Flexibility to scale involvement as needs evolve</li>
              </ul>
              <p className="mb-4">The model works because it's structured for impact, not for billing hours.</p>
              <p>The best fractional leaders build organizations that don't need them anymore. That's the definition of installed leadership done right.</p>
            </>
          ),
        },
        {
          title: "How to Evaluate Installed Leadership",
          content: (
            <>
              <p className="mb-4">When evaluating a fractional or installed leader, ask:</p>
              <ul className="list-none space-y-1 mb-4 text-muted-foreground">
                <li>Will they have decision authority or just advisory access?</li>
                <li>Will they integrate with teams or operate separately?</li>
                <li>Will they build systems or deliver recommendations?</li>
                <li>Is there a defined arc toward transition?</li>
                <li>Are they accountable for outcomes or just deliverables?</li>
              </ul>
              <p>If the answers lean toward advisory, you're hiring a consultant. If they lean toward installation, you're investing in structural change.</p>
            </>
          ),
        },
      ]}
      faqItems={[
        {
          question: "Is installed leadership the same as fractional leadership?",
          answer: "Fractional is the structure (part-time, retainer-based). Installed is the operating model (embedded, authorized, accountable). The best fractional leaders operate as installed leaders.",
        },
        {
          question: "How long does installed leadership typically last?",
          answer: "6–18 months, depending on the complexity of the constraint and the organization's readiness to sustain the systems built.",
        },
        {
          question: "Can installed leadership work remotely?",
          answer: "Yes. What matters is access, authority, and integration — not physical presence. Most installed leaders operate in a hybrid model.",
        },
        {
          question: "What's the difference between this and an interim CMO?",
          answer: "An interim CMO fills a vacancy. Installed leadership fills a capability gap. The interim expects to be replaced by a permanent hire. The installed leader expects to build a system that outlasts the engagement.",
        },
      ]}
      relatedLinks={[
        { title: "When to Hire a Fractional CMO", url: "/strategic-answers/when-to-hire-fractional-cmo" },
        { title: "How Much Does a Fractional CMO Cost?", url: "/strategic-answers/fractional-cmo-cost" },
        { title: "Why Growth Stalls", url: "/strategic-answers/why-growth-stalls" },
        { title: "Rick Julian", url: "/rick-julian" },
      ]}
    />
  );
};

export default InstalledLeadershipModel;
