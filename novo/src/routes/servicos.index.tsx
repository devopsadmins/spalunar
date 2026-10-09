import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SERVICES, WHATSAPP_URL } from "@/lib/site";

export const Route = createFileRoute("/servicos/")({
  head: () => ({
    meta: [
      { title: "Serviços — SPA LUNAR Clínica Evelin Oliveira" },
      {
        name: "description",
        content:
          "Conheça os tratamentos da SPA LUNAR: Corrente Russa, Criolipólise, Detox Corporal e Drenagens Linfáticas — corpo, rosto e bem-estar no Morumbi.",
      },
      { property: "og:title", content: "Serviços — SPA LUNAR" },
      {
        property: "og:description",
        content:
          "Tratamentos corporais, faciais e SPA na clínica Evelin Oliveira, no Morumbi.",
      },
    ],
  }),
  component: ServicosIndex,
});

function ServicosIndex() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="border-b border-border py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
            Nossos tratamentos
          </span>
          <h1 className="mb-8 font-display text-5xl leading-[0.95] md:text-7xl">
            Tratamentos que <span className="italic">cuidam</span> de você por inteiro.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Protocolos personalizados de estética corporal, facial e SPA — sempre
            adaptados ao seu ritmo e objetivos.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                to="/servicos/$slug"
                params={{ slug: s.slug }}
                className="group rounded-[32px] border border-border bg-background p-2 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="overflow-hidden rounded-[24px]">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-secondary">
                    {s.category}
                  </span>
                  <h3 className="mb-2 font-display text-xl">{s.name}</h3>
                  <p className="text-sm text-muted-foreground">{s.short}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-primary px-10 py-4 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/10 hover:brightness-110"
            >
              Agendar avaliação
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
