import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  IMAGES,
  SERVICES,
  WHATSAPP_URL,
  whatsappFor,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { property: "og:image", content: IMAGES.hero },
      { name: "twitter:image", content: IMAGES.hero },
    ],
  }),
});

const areas = [
  {
    n: "01",
    name: "Tratamento Corporal",
    desc: "Protocolos para modelar, tonificar e tratar a pele com eficácia. Atuamos na redução de medidas, celulite, flacidez e retenção de líquidos, unindo tecnologia, técnica e atendimento personalizado.",
    image: IMAGES.servicoCorporal,
    slug: "corrente-russa",
    offset: false,
  },
  {
    n: "02",
    name: "Rejuvenescimento Facial",
    desc: "Limpeza profunda, hidratação, renovação celular e combate aos sinais da idade. Técnicas modernas e produtos de alta qualidade, sempre adaptados ao seu tipo de pele.",
    image: IMAGES.servicoFacial,
    slug: "criolipolise",
    offset: true,
  },
  {
    n: "03",
    name: "SPA & Bem-estar",
    desc: "Massagens, rituais sensoriais e tratamentos exclusivos em um ambiente acolhedor. Uma jornada pensada para você desacelerar e se reconectar com sua essência.",
    image: IMAGES.servicoSpa,
    slug: "drenagens-linfaticas",
    offset: false,
  },
];

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

const testimonials = [
  {
    name: "Melissa Pontes",
    text:
      "Experiência incrível começando pelo atendimento da Sra. Evelyn na recepção. O momento relaxante da massagem me proporcionou um momento único — ambiente seguro e aconchegante. Superou minhas expectativas.",
  },
  {
    name: "Ieda Brandão",
    text:
      "Fiz a Criolipólise e estou muito satisfeita com os resultados. O ambiente é aconchegante e a equipe muito atenciosa. Vale a pena se cuidar e ser bem cuidada.",
  },
  {
    name: "Rozana Ventura",
    text:
      "Excelentes profissionais, tratamentos personalizados e produtos naturais de qualidade. Agradeço pelo carinho e pela disponibilidade em sempre encontrar um horário na minha rotina.",
  },
  {
    name: "Eva Carvalho",
    text:
      "Eu gosto de tudo, do atendimento aos serviços. As massagens, o skin care, as salas de água... é tudo de bom. Eu me dou de presente sempre — serviço de qualidade traz saúde.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pb-24 pt-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-12">
          <div className="z-10 animate-reveal md:col-span-6">
            <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
              Clínica Evelin Oliveira · Morumbi
            </span>
            <h1 className="mb-8 font-display text-5xl leading-[0.95] text-balance md:text-7xl lg:text-8xl">
              Estética facial e corporal <span className="italic">avançada</span>.
            </h1>
            <p className="mb-10 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">
              Há 20 anos unindo experiência e inovação para promover beleza,
              saúde e bem-estar. Um refúgio no Morumbi dedicado à sua autoestima.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-primary px-8 py-4 text-center font-medium text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:brightness-110"
              >
                Quero agendar avaliação
              </a>
              <Link
                to="/sobre"
                className="rounded-full border border-foreground/20 px-8 py-4 text-center font-medium transition-all hover:bg-foreground hover:text-background"
              >
                Conhecer a clínica
              </Link>
            </div>
          </div>
          <div className="relative animate-reveal md:col-span-6 [animation-delay:200ms]">
            <div className="relative z-10 overflow-hidden rounded-[40px]">
              <img
                src={IMAGES.hero}
                alt="Ambiente do SPA LUNAR Clínica Evelin Oliveira"
                width={1088}
                height={1360}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 -z-10 h-48 w-48 rounded-full bg-secondary/30 blur-3xl" />
          </div>
        </div>
      </section>

      {/* About / Sobre */}
      <section id="sobre" className="border-t border-border py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
            Quem somos
          </span>
          <h2 className="mb-10 font-display text-3xl leading-tight md:text-5xl">
            Duas décadas dedicadas à sua melhor versão.
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Na <strong className="text-foreground">SPA LUNAR Clínica Evelin Oliveira</strong>,
            unimos experiência e inovação para oferecer tratamentos que promovem beleza,
            saúde e bem-estar. Nossa fundadora,{" "}
            <strong className="text-foreground">Evelin Oliveira</strong>, é esteticista,
            cosmetóloga, professora e palestrante — formada pela Universidade Paulista (UNIP),
            com presença constante em programas de TV da Rede Brasil, Rit TV e Rede Gospel.
          </p>
          <div className="mt-10">
            <Link
              to="/sobre"
              className="text-xs font-bold uppercase tracking-widest text-primary underline-offset-4 hover:underline"
            >
              Ler a história completa →
            </Link>
          </div>
        </div>
      </section>

      {/* Áreas */}
      <section id="tratamentos" className="bg-white/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <h2 className="max-w-md font-display text-4xl md:text-5xl">
              Nossas três frentes de cuidado.
            </h2>
            <p className="max-w-sm font-mono text-xs uppercase tracking-widest text-secondary">
              Tratamentos personalizados para o seu ritmo e objetivo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {areas.map((s) => (
              <Link
                key={s.n}
                to="/servicos/$slug"
                params={{ slug: s.slug }}
                className={
                  "group relative rounded-[32px] border border-border bg-background p-2 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl" +
                  (s.offset ? " md:mt-12" : "")
                }
              >
                <div className="overflow-hidden rounded-[24px] bg-stone-100">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    width={600}
                    height={800}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="mb-3 block font-mono text-xs text-primary">
                    {s.n}
                  </span>
                  <h3 className="mb-3 font-display text-2xl">{s.name}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                  <span className="border-b border-primary pb-1 text-xs font-bold uppercase tracking-widest text-primary">
                    Ver protocolo
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Featured protocols */}
          <div className="mt-24">
            <div className="mb-10 flex items-end justify-between gap-6">
              <h3 className="font-display text-2xl md:text-3xl">
                Protocolos em destaque
              </h3>
              <Link
                to="/servicos"
                className="hidden font-mono text-[10px] uppercase tracking-widest text-primary underline-offset-4 hover:underline md:block"
              >
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[32px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((f, i) => (
                <Link
                  key={f.slug}
                  to="/servicos/$slug"
                  params={{ slug: f.slug }}
                  className="bg-background p-8 transition-colors hover:bg-accent"
                >
                  <span className="mb-4 block font-mono text-[10px] text-secondary">
                    0{i + 1}
                  </span>
                  <h4 className="mb-2 font-display text-xl">{f.name}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.short}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="diferenciais" className="py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:gap-24">
          <div>
            <img
              src={IMAGES.servicoSpa}
              alt="Ambiente do SPA LUNAR"
              loading="lazy"
              width={1000}
              height={1200}
              className="aspect-[5/6] w-full rounded-[60px] object-cover"
            />
          </div>
          <div className="space-y-16">
            <h2 className="font-display text-4xl md:text-5xl">
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
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="bg-foreground py-24 text-background md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-2xl">
            <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
              Depoimentos
            </span>
            <h2 className="font-display text-4xl md:text-5xl">
              A palavra de quem já viveu a experiência.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-[32px] border border-background/10 p-10"
              >
                <div className="mb-6 flex gap-1 text-primary">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
                <p className="mb-8 font-display text-xl leading-snug md:text-2xl">
                  “{t.text}”
                </p>
                <cite className="font-mono text-[10px] uppercase not-italic tracking-[0.3em] opacity-60">
                  {t.name}
                </cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contato" className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[60px] bg-secondary/15 p-12 text-center md:p-24">
            <div className="relative z-10">
              <h2 className="mb-8 font-display text-4xl md:text-6xl lg:text-7xl">
                Libere sua autoconfiança.
              </h2>
              <p className="mx-auto mb-12 max-w-xl text-lg opacity-80">
                Conte com a SPA LUNAR para alcançar uma aparência que inspira
                autoestima e segurança. Fale conosco e inicie sua transformação.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={whatsappFor()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-foreground px-10 py-5 text-xs font-bold uppercase tracking-widest text-background transition-all hover:bg-primary md:px-12"
                >
                  Fale conosco pelo WhatsApp
                </a>
                <Link
                  to="/contato"
                  className="inline-flex rounded-full border border-foreground/20 px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background"
                >
                  Ver endereço e canais
                </Link>
              </div>
            </div>
            <div className="absolute right-0 top-0 -z-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
