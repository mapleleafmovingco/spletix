import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Braces } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function SiteHeader() {
  const { user, isAdmin } = useAuth();
  const linkCls = "transition-colors hover:text-foreground";
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Braces className="size-4" />
          </span>
          Stackforge
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/" className={linkCls} activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>Home</Link>
          <Link to="/services" className={linkCls} activeProps={{ className: "text-foreground" }}>Services</Link>
          {user && <Link to="/portal" className={linkCls} activeProps={{ className: "text-foreground" }}>Portal</Link>}
          {isAdmin && <Link to="/admin" className={linkCls} activeProps={{ className: "text-foreground" }}>Admin</Link>}
        </nav>
        <Link
          to={user ? "/portal" : "/auth"}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
        >
          {user ? "Client portal" : "Sign in"} <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </header>
  );
}
