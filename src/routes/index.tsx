import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Braces,
  Layers,
  Sparkles,
  Workflow,
  PenTool,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stackforge — Full-Stack Apps, AI Automation & Design Studio" },
      {
        name: "description",
        content:
          "Stackforge is a tech studio building full-stack web applications, AI automations, and standout digital design for ambitious teams.",
      },
      { property: "og:title", content: "Stackforge — Full-Stack Apps, AI Automation & Design Studio" },
      {
        property: "og:description",
        content:
          "We design, build, and automate full-stack digital products — from idea to production.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const services = [
  {
    icon: Layers,
    title: "Full-Stack Development",
    desc: "End-to-end web applications — frontend, backend, APIs, and infrastructure — engineered to scale with your business.",
  },
  {
    icon: Bot,
    title: "AI Automation",
    desc: "Intelligent workflows, agents, and integrations that remove busywork and let your team focus on what matters.",
  },
  {
    icon: PenTool,
    title: "Product Design",
    desc: "Interfaces people love to use. Brand, UI/UX, and design systems crafted with obsessive attention to detail.",
  },
  {
    icon: Workflow,
    title: "Systems & Integrations",
    desc: "We connect your tools, data, and pipelines into one coherent system — no more copy-paste operations.",
  },
];

const stats = [
  { value: "40+", label: "Products shipped" },
  { value: "12M+", label: "Users reached" },
  { value: "98%", label: "Client retention" },
  { value: "24/7", label: "Systems monitored" },
];

const stack = [
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "AI Agents",
  "LLM Pipelines",
  "Edge Compute",
  "Design Systems",
  "Cloud Infrastructure",
  "Realtime APIs",
];

const process = [
  {
    step: "01",
    title: "Discover",
    desc: "We dig into your goals, users, and constraints to define exactly what success looks like.",
  },
  {
    step: "02",
    title: "Design",
    desc: "Rapid prototypes and polished interfaces, validated with real users before a line of production code.",
  },
  {
    step: "03",
    title: "Build",
    desc: "Full-stack engineering in tight iterations — you see working software every week, not every quarter.",
  },
  {
    step: "04",
    title: "Scale",
    desc: "Launch, measure, automate, and grow. We stay on as your product partner long after v1.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section id="top" className="relative overflow-hidden pt-16">
        <div className="pointer-events-none absolute inset-0">
          <img
            src={heroImg}
            alt=""
            width={1600}
            height={912}
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-28 pt-28 text-center md:pt-36">
          <span className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" /> Full-stack studio · AI-first
          </span>
          <h1 className="mt-8 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            We build the software that <span className="text-gradient">builds your business</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Stackforge is a tech studio crafting full-stack web apps, AI automations, and
            unforgettable digital design — from first sketch to production scale.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#contact"
              className="glow-ring inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground transition-transform hover:scale-105"
            >
              Start a project <ArrowRight className="size-4" />
            </a>
            <a
              href="#services"
              className="glass-panel inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium transition-colors hover:bg-secondary"
            >
              Explore services
            </a>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section id="stack" className="border-y border-border/60 py-6">
        <div className="overflow-hidden">
          <div className="animate-marquee flex w-max gap-10 pr-10">
            {[...stack, ...stack].map((item, i) => (
              <span key={i} className="whitespace-nowrap text-sm font-medium uppercase tracking-widest text-muted-foreground">
                {item} <span className="ml-10 text-primary">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">What we do</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            One studio. Every layer of your product.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="glass-panel group rounded-2xl p-8 transition-all hover:-translate-y-1 hover:glow-ring"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="size-6" />
              </span>
              <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold text-primary md:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">How we work</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            From idea to production, without the drama.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {process.map((p) => (
            <div key={p.step} className="rounded-2xl border border-border/60 p-7">
              <p className="text-sm font-bold text-primary">{p.step}</p>
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="mx-auto max-w-6xl px-6 pb-28">
        <div className="glass-panel animate-float-slow relative overflow-hidden rounded-3xl px-8 py-16 text-center md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5" />
          <h2 className="relative mx-auto max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
            Have something to build? <span className="text-gradient">Let's talk.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us where you want to go — we'll map the fastest route from idea to a product
            your users love.
          </p>
          <a
            href="mailto:hello@stackforge.dev"
            className="glow-ring relative mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground transition-transform hover:scale-105"
          >
            hello@stackforge.dev <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <p>© 2026 Stackforge Labs. All rights reserved.</p>
          <p>Full-stack apps · AI automation · Design</p>
        </div>
      </footer>
    </div>
  );
}
