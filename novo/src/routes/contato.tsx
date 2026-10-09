import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  ADDRESS,
  EMAIL,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  WHATSAPP_URL,
} from "@/lib/site";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — SPA LUNAR Clínica Evelin Oliveira" },
      {
        name: "description",
        content:
          "Fale com a SPA LUNAR no Morumbi, São Paulo. WhatsApp (11) 95993-9701, e-mail e endereço para agendar sua avaliação.",
      },
      { property: "og:title", content: "Contato — SPA LUNAR" },
      {
        property: "og:description",
        content:
          "Endereço, telefone, WhatsApp e Instagram da SPA LUNAR Clínica Evelin Oliveira.",
      },
    ],
  }),
  component: Contato,
});

function Contato() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="border-b border-border py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
            Vamos conversar
          </span>
          <h1 className="mb-8 font-display text-5xl leading-[0.95] md:text-7xl">
            Fale com a SPA LUNAR.
          </h1>
          <p className="text-lg text-muted-foreground">
            Agende sua avaliação, tire dúvidas e conheça os protocolos ideais para
            você. Estamos no Morumbi, Zona Sul de São Paulo.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 md:grid-cols-2">
          <div className="rounded-[32px] border border-border bg-white/40 p-10">
            <h2 className="mb-6 font-display text-2xl">Canais diretos</h2>
            <ul className="space-y-5 text-base">
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-secondary">
                  WhatsApp
                </span>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block hover:text-primary"
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-secondary">
                  Telefone
                </span>
                <a href={PHONE_HREF} className="mt-1 inline-block hover:text-primary">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-secondary">
                  E-mail
                </span>
                <a
                  href={`mailto:${EMAIL}`}
                  className="mt-1 inline-block hover:text-primary"
                >
                  {EMAIL}
                </a>
              </li>
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-secondary">
                  Instagram
                </span>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block hover:text-primary"
                >
                  @spalunaresteticaevelinoliveira
                </a>
              </li>
            </ul>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-10 block rounded-full bg-foreground px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-background hover:bg-primary"
            >
              Falar no WhatsApp agora
            </a>
          </div>

          <div className="rounded-[32px] border border-border bg-white/40 p-10">
            <h2 className="mb-6 font-display text-2xl">Onde estamos</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              {ADDRESS.street}
              <br />
              {ADDRESS.neighborhood}
              <br />
              {ADDRESS.city}
              <br />
              CEP {ADDRESS.zip}
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Localização SPA LUNAR"
                src="https://www.google.com/maps?q=Rua+David+Ben+Gurion,+412+-+Morumbi,+S%C3%A3o+Paulo&output=embed"
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
