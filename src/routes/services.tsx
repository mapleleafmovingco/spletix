import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Cloud, Database, Layers, PenTool, ShieldCheck, Smartphone, Workflow } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Enterprise Services — Stackforge Labs" },
      { name: "description", content: "Full-stack apps, mobile, AI automation, cloud & DevOps, data, security and integrations for modern enterprises." },
      { property: "og:title", content: "Enterprise Services — Stackforge Labs" },
      { property: "og:description", content: "Every layer of the modern enterprise stack, designed, built and operated by one team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Layers, title: "Full-Stack Web Applications", desc: "Customer portals, SaaS platforms and internal tools built on modern, type-safe stacks.", items: ["React / TypeScript frontends", "REST & GraphQL APIs", "Server-side rendering & edge", "Multi-tenant architecture"] },
  { icon: Smartphone, title: "Mobile & Cross-Platform", desc: "Native-quality mobile experiences sharing logic with your web platform.", items: ["iOS & Android", "Progressive web apps", "Offline sync", "Push notifications"] },
  { icon: Bot, title: "AI Automation & Agents", desc: "LLM-powered assistants, document processing and workflow agents that do real work.", items: ["Custom AI assistants", "RAG over company knowledge", "Document & email automation", "AI evaluation & guardrails"] },
  { icon: Cloud, title: "Cloud & DevOps", desc: "Reliable infrastructure with automated delivery and full observability.", items: ["CI/CD pipelines", "Infrastructure as code", "Monitoring & alerting", "Cost optimization"] },
  { icon: Database, title: "Data & Analytics", desc: "Turn scattered data into dashboards and decisions.", items: ["Data warehousing", "ETL pipelines", "BI dashboards", "Realtime analytics"] },
  { icon: ShieldCheck, title: "Security & Compliance", desc: "Enterprise-grade security baked in from day one.", items: ["SSO / SAML & role-based access", "Audit logging", "GDPR / SOC 2 readiness", "Penetration testing"] },
  { icon: Workflow, title: "Systems Integration", desc: "Connect CRMs, ERPs, payments and legacy systems into one coherent platform.", items: ["Salesforce, HubSpot, SAP", "Stripe & payments", "Webhooks & event buses", "Legacy modernization"] },
  { icon: PenTool, title: "Product & UX Design", desc: "Research-driven design systems that scale across products and teams.", items: ["UX research", "Design systems", "Prototyping", "Accessibility (WCAG)"] },
];

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-36">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Services</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
          Everything a modern enterprise needs to <span className="text-gradient">ship software</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          From strategy to production operations — one accountable team across every layer of your stack.
        </p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 md:grid-cols-2">
        {services.map((s) => (
          <div key={s.title} className="glass-panel rounded-2xl p-8">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
              <s.icon className="size-6" />
            </span>
            <h2 className="mt-6 text-xl font-semibold">{s.title}</h2>
            <p className="mt-2 text-muted-foreground">{s.desc}</p>
            <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
              {s.items.map((i) => (
                <li key={i} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" />{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-28 text-center">
        <Link to="/portal" className="glow-ring inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground">
          Request a project <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
