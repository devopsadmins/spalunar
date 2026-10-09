import { Link } from "@tanstack/react-router";
import { LOGO_URL, NAV_ITEMS, WHATSAPP_URL } from "@/lib/site";

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3" aria-label="SPA LUNAR — Início">
          <img
            src={LOGO_URL}
            alt="SPA LUNAR Clínica Evelin Oliveira"
            className="h-10 w-auto invert"
          />
        </Link>
        <div className="hidden items-center gap-10 text-sm font-medium uppercase tracking-widest md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-foreground px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-background transition-colors duration-300 hover:bg-primary md:px-6 md:text-[11px]"
        >
          Agendar
        </a>
      </div>
    </nav>
  );
}
