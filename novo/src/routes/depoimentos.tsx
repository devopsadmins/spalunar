import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WHATSAPP_URL } from "@/lib/site";

const VIDEOS = [
  {
    src: "https://www.hevelynestetica.com.br/imagens/videos/depoimento.mp4",
    name: "Cliente SPA LUNAR",
  },
  {
    src: "https://www.hevelynestetica.com.br/imagens/videos/depoimento1.mp4",
    name: "Cliente SPA LUNAR",
  },
  {
    src: "https://www.hevelynestetica.com.br/imagens/videos/depoimento2.mp4",
    name: "Cliente SPA LUNAR",
  },
  {
    src: "https://www.hevelynestetica.com.br/imagens/videos/depoimento3.mp4",
    name: "Cliente SPA LUNAR",
  },
];

const TEXT_TESTIMONIALS = [
  {
    name: "Melissa Pontes",
    text: "Ambiente maravilhoso, atendimento impecável e resultados que superaram minhas expectativas. Recomendo demais a SPA LUNAR!",
  },
  {
    name: "Ieda Brandão",
    text: "A Evelin é uma profissional excepcional. Cuidado, escuta e técnica em cada sessão. Me sinto renovada.",
  },
  {
    name: "Rozana Ventura",
    text: "Frequento há anos e sempre saio de lá me sentindo melhor. Um verdadeiro refúgio de bem-estar no Morumbi.",
  },
  {
    name: "Eva Carvalho",
    text: "Protocolos personalizados e resultados visíveis. A equipe é acolhedora e o ambiente é uma delícia.",
  },
];

export const Route = createFileRoute("/depoimentos")({
  head: () => ({
    meta: [
      { title: "Depoimentos — SPA LUNAR Clínica Evelin Oliveira" },
      {
        name: "description",
        content:
          "Veja o que nossos clientes dizem sobre os tratamentos estéticos e a experiência na SPA LUNAR, clínica da Evelin Oliveira no Morumbi.",
      },
      { property: "og:title", content: "Depoimentos — SPA LUNAR" },
      {
        property: "og:description",
        content:
          "Histórias reais de quem viveu a experiência SPA LUNAR no Morumbi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DepoimentosPage,
});

function DepoimentosPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-24 md:pt-32">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-secondary">
          Depoimentos
        </p>
        <h1 className="max-w-3xl font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
          Veja o que nossos clientes dizem de nós
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Cada resultado é uma história — de autoestima, cuidado e confiança
          reencontrada. Assista aos vídeos e leia os relatos de quem já vive a
          experiência SPA LUNAR.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {VIDEOS.map((v) => (
            <figure
              key={v.src}
              className="overflow-hidden rounded-3xl border border-border bg-card"
            >
              <video
                controls
                preload="metadata"
                playsInline
                className="aspect-[9/16] w-full bg-black object-cover md:aspect-video"
              >
                <source src={v.src} type="video/mp4" />
                Seu navegador não suporta vídeos em HTML5.
              </video>
              <figcaption className="px-6 py-4 font-mono text-[11px] uppercase tracking-widest text-secondary">
                {v.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="mb-12 font-display text-3xl md:text-4xl">
          Relatos de clientes
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {TEXT_TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-3xl border border-border bg-card p-8"
            >
              <p className="mb-6 text-lg leading-relaxed">“{t.text}”</p>
              <footer className="font-mono text-[11px] uppercase tracking-widest text-secondary">
                — {t.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="rounded-3xl border border-border bg-card px-8 py-16 text-center md:px-16 md:py-24">
          <h2 className="mx-auto max-w-2xl font-display text-4xl leading-tight md:text-5xl">
            Sua história pode ser a próxima.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Agende sua avaliação e descubra o protocolo ideal para você.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background transition-colors hover:bg-primary"
          >
            Agendar pelo WhatsApp
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
