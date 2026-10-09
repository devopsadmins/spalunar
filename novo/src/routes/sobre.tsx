import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IMAGES, WHATSAPP_URL } from "@/lib/site";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — SPA LUNAR Clínica Evelin Oliveira" },
      {
        name: "description",
        content:
          "Conheça a história da SPA LUNAR e da fundadora Evelin Oliveira — 20 anos de estética avançada no Morumbi, São Paulo.",
      },
      { property: "og:title", content: "Sobre — SPA LUNAR" },
      {
        property: "og:description",
        content:
          "Duas décadas de dedicação à estética avançada. Conheça Evelin Oliveira e a filosofia da clínica.",
      },
      { property: "og:image", content: IMAGES.hero },
    ],
  }),
  component: Sobre,
});

const pillars = [
  {
    n: "01.",
    title: "20 Anos de Experiência",
    desc: "Duas décadas de dedicação à estética avançada, com Evelin Oliveira à frente há 14 anos.",
  },
  {
    n: "02.",
    title: "Especialista Reconhecida",
    desc: "Esteticista, cosmetóloga, professora e palestrante formada pela Universidade Paulista (UNIP), com presença constante na mídia — Rede Brasil, Rit TV e Rede Gospel.",
  },
  {
    n: "03.",
    title: "Ambiente Acolhedor",
    desc: "Um refúgio no Morumbi projetado para elevar sua autoestima com segurança, conforto e resultados reais.",
  },
];

function Sobre() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="border-b border-border py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-12">
          <div className="md:col-span-6">
            <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
              Nossa história
            </span>
            <h1 className="mb-8 font-display text-5xl leading-[0.95] md:text-7xl">
              Duas décadas dedicadas à sua <span className="italic">melhor versão</span>.
            </h1>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              Na <strong className="text-foreground">SPA LUNAR Clínica Evelin Oliveira</strong>,
              unimos experiência e inovação para oferecer tratamentos que promovem
              beleza, saúde e bem-estar. Há 20 anos, destacamo-nos pelo atendimento
              personalizado e pela busca contínua da excelência.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Nossa fundadora,{" "}
              <strong className="text-foreground">Evelin Oliveira</strong>, é
              esteticista, cosmetóloga, professora e palestrante formada pela
              Universidade Paulista (UNIP). Está à frente da SPA LUNAR há 14 anos e
              tem presença constante em programas de TV na Rede Brasil, Rit TV e
              Rede Gospel — sempre compartilhando conhecimento e inspirando cuidado.
            </p>
          </div>
          <div className="md:col-span-6">
            <div className="overflow-hidden rounded-[40px]">
              <img
                src={IMAGES.hero}
                alt="SPA LUNAR Clínica Evelin Oliveira"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-16 font-display text-3xl md:text-5xl">
            Por que confiar no SPA LUNAR
          </h2>
          <div className="space-y-12">
            {pillars.map((p) => (
              <div key={p.n} className="flex gap-6">
                <span className="font-mono text-sm text-primary">{p.n}</span>
                <div>
                  <h4 className="mb-2 text-lg font-medium uppercase tracking-wide">
                    {p.title}
                  </h4>
                  <p className="leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/10 hover:brightness-110"
            >
              Agendar avaliação
            </a>
            <Link
              to="/servicos"
              className="rounded-full border border-foreground/20 px-8 py-4 text-sm font-medium hover:bg-foreground hover:text-background"
            >
              Ver serviços
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
