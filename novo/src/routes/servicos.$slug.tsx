import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getService, SERVICES, whatsappFor } from "@/lib/site";

export const Route = createFileRoute("/servicos/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Serviço não encontrado — SPA LUNAR" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { service } = loaderData;
    const title = `${service.name} — SPA LUNAR Clínica Evelin Oliveira`;
    const description = service.short;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: service.image },
        { name: "twitter:image", content: service.image },
      ],
    };
  },
  component: ServicePage,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="mb-6 font-display text-4xl md:text-6xl">
          Serviço não encontrado
        </h1>
        <p className="mb-10 text-muted-foreground">
          O tratamento que você procura não existe ou foi movido. Explore nossos
          serviços disponíveis.
        </p>
        <Link
          to="/servicos"
          className="inline-flex rounded-full bg-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest text-background hover:bg-primary"
        >
          Ver todos os serviços
        </Link>
      </section>
      <SiteFooter />
    </div>
  );
}

function ServicePage() {
  const { service } = Route.useLoaderData();
  const cta = whatsappFor(service.slug);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-12">
          <div className="md:col-span-6">
            <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
              {service.category} · SPA LUNAR
            </span>
            <h1 className="mb-8 font-display text-5xl leading-[0.95] md:text-7xl">
              {service.name}
            </h1>
            <p className="mb-10 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
              {service.intro}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href={cta}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-primary px-8 py-4 text-center font-medium text-primary-foreground shadow-lg shadow-primary/10 hover:brightness-110"
              >
                Faça seu orçamento
              </a>
              <Link
                to="/contato"
                className="rounded-full border border-foreground/20 px-8 py-4 text-center font-medium hover:bg-foreground hover:text-background"
              >
                Falar com a clínica
              </Link>
            </div>
          </div>
          <div className="md:col-span-6">
            <div className="overflow-hidden rounded-[40px]">
              <img
                src={service.image}
                alt={service.name}
                width={1088}
                height={1360}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 md:grid-cols-12">
          <article className="prose prose-neutral max-w-none md:col-span-8">
            <h2 className="mb-6 font-display text-3xl md:text-4xl">
              Sobre o tratamento
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
              {service.what}
            </p>

            <h3 className="mb-6 font-display text-2xl md:text-3xl">Benefícios</h3>
            <ul className="mb-12 space-y-3">
              {service.benefits.map((b: string) => (
                <li key={b} className="flex gap-3 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                  {b}
                </li>
              ))}
            </ul>

            <h3 className="mb-6 font-display text-2xl md:text-3xl">
              Por que a SPA LUNAR
            </h3>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {service.why}
            </p>
          </article>

          <aside className="md:col-span-4">
            <div className="sticky top-28 space-y-6 rounded-[32px] border border-border bg-white/40 p-8">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-secondary">
                Agende sua avaliação
              </span>
              <h3 className="font-display text-2xl">
                Fale conosco pelo WhatsApp
              </h3>
              <p className="text-sm text-muted-foreground">
                Nossa equipe responde suas dúvidas e monta um plano personalizado
                para o seu objetivo.
              </p>
              <a
                href={cta}
                target="_blank"
                rel="noreferrer"
                className="block rounded-full bg-foreground px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-background hover:bg-primary"
              >
                Orçamento no WhatsApp
              </a>
              <Link
                to="/servicos"
                className="block text-center text-xs font-bold uppercase tracking-widest text-primary underline-offset-4 hover:underline"
              >
                Ver todos os serviços
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-border bg-white/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 font-display text-3xl md:text-4xl">
            Tratamentos relacionados
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.filter((s) => s.slug !== service.slug)
              .slice(0, 3)
              .map((s) => (
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
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
