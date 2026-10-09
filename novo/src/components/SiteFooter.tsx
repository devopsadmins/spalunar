import {
  ADDRESS,
  EMAIL,
  INSTAGRAM_URL,
  LOGO_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  WHATSAPP_URL,
} from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border pb-12 pt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-24 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <img
              src={LOGO_URL}
              alt="SPA LUNAR Clínica Evelin Oliveira"
              className="mb-8 h-14 w-auto invert"
            />
            <p className="mb-2 text-sm uppercase tracking-widest text-secondary">
              Clínica Evelin Oliveira
            </p>
            <p className="max-w-xs leading-relaxed text-muted-foreground">
              Estética facial e corporal avançada. Beleza, saúde e bem-estar
              há 20 anos no Morumbi.
            </p>
          </div>
          <div>
            <h5 className="mb-6 font-mono text-[10px] uppercase tracking-widest">
              Contato
            </h5>
            <ul className="space-y-4 text-sm">
              <li>
                <a href={PHONE_HREF} className="hover:text-primary">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="hover:text-primary">
                  {EMAIL}
                </a>
              </li>
              <li className="text-muted-foreground">
                {ADDRESS.street}
                <br />
                {ADDRESS.neighborhood}
                <br />
                {ADDRESS.city} · {ADDRESS.zip}
              </li>
            </ul>
          </div>
          <div>
            <h5 className="mb-6 font-mono text-[10px] uppercase tracking-widest">
              Siga
            </h5>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://linkbio.co/spalunarclinic"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  Link na bio
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-6 border-t border-border pt-12 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">
            © 2026 SPA LUNAR Clínica Evelin Oliveira. Todos os direitos reservados.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">
            Zona Sul de São Paulo
          </p>
        </div>
      </div>
    </footer>
  );
}
