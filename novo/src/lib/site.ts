const LOGO_URL_LOCAL = "/images/lovable/logo-lunar.png";
const HERO_URL_LOCAL = "/images/lovable/real-hero.png";
const SERVICO_1_URL_LOCAL = "/images/lovable/real-servico-1.png";
const SERVICO_2_URL_LOCAL = "/images/lovable/real-servico-2.png";
const SERVICO_3_URL_LOCAL = "/images/lovable/real-servico-3.png";

export const LOGO_URL = LOGO_URL_LOCAL;

export const WHATSAPP_URL =
  "https://wa.me/5511959939701?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20no%20SPA%20LUNAR.";
export const INSTAGRAM_URL =
  "https://www.instagram.com/spalunaresteticaevelinoliveira";
export const PHONE_HREF = "tel:+5511959939701";
export const PHONE_DISPLAY = "(11) 95993-9701";
export const EMAIL = "hevelynestetica@yahoo.com.br";
export const ADDRESS = {
  street: "Rua David Ben Gurion, 412 — Piso Superior",
  neighborhood: "Morumbi",
  city: "São Paulo — SP",
  zip: "05634-001",
};

export const IMAGES = {
  hero: HERO_URL_LOCAL,
  servicoCorporal: SERVICO_1_URL_LOCAL,
  servicoFacial: SERVICO_2_URL_LOCAL,
  servicoSpa: SERVICO_3_URL_LOCAL,
};

export const NAV_ITEMS = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/sobre", label: "Sobre" },
  { to: "/depoimentos", label: "Depoimentos" },
  { to: "/contato", label: "Contato" },
] as const;

export function whatsappFor(service?: string) {
  const base =
    "Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20no%20SPA%20LUNAR";
  const suffix = service ? `%20para%20${encodeURIComponent(service)}` : "";
  return `https://wa.me/5511959939701?text=${base}${suffix}.`;
}

export type Service = {
  slug: string;
  name: string;
  category: "Corporal" | "Facial" | "SPA & Bem-estar";
  image: string;
  short: string;
  intro: string;
  what: string;
  benefits: string[];
  why: string;
  related: { name: string; slug?: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "corrente-russa",
    name: "Corrente Russa",
    category: "Corporal",
    image: SERVICO_1_URL_LOCAL,
    short: "Tonificação muscular e definição de contornos com eletroestimulação.",
    intro:
      "A corrente russa é um tratamento estético inovador que utiliza correntes elétricas de média frequência para estimular os músculos, promovendo contração e tonificação de forma não invasiva. Na SPA LUNAR, o protocolo é conduzido por profissionais experientes que ajustam intensidade e tempo à sua individualidade.",
    what:
      "Também conhecida como eletroestimulação, a técnica melhora o tônus muscular, reduz a flacidez e modela o corpo. É uma alternativa segura para quem busca resultados visíveis em poucas sessões, sem tempo de recuperação.",
    benefits: [
      "Redução da flacidez muscular",
      "Modelagem e melhora do contorno corporal",
      "Ação anti-inflamatória e relaxante",
      "Estímulo da circulação sanguínea",
      "Aumento da produção de colágeno",
    ],
    why:
      "Combinamos a tecnologia com a expertise de Evelin Oliveira e sua equipe para garantir um atendimento personalizado, seguro e com resultados consistentes.",
    related: [
      { name: "Criolipólise", slug: "criolipolise" },
      { name: "Detox Corporal", slug: "detox-corporal" },
      { name: "Drenagens Linfáticas", slug: "drenagens-linfaticas" },
    ],
  },
  {
    slug: "criolipolise",
    name: "Criolipólise",
    category: "Corporal",
    image: SERVICO_2_URL_LOCAL,
    short: "Redução de gordura localizada com resfriamento controlado.",
    intro:
      "A criolipólise é um procedimento não invasivo para redução de gordura localizada. Através do resfriamento controlado, as células de gordura são destruídas sem prejuízo aos tecidos adjacentes — o próprio organismo as elimina naturalmente ao longo das semanas seguintes.",
    what:
      "A técnica é ideal para quem busca modelagem do contorno corporal com um procedimento seguro, sem cortes e sem tempo de recuperação. As primeiras respostas costumam aparecer entre 30 e 60 dias após a sessão.",
    benefits: [
      "Redução de medidas e modelagem do corpo",
      "Procedimento não invasivo",
      "Ausência de tempo de recuperação",
      "Resultados visíveis e duradouros",
      "Eliminação segura da gordura localizada",
    ],
    why:
      "Trabalhamos com equipamentos de última geração e atendimento personalizado, do diagnóstico ao acompanhamento pós-sessão.",
    related: [
      { name: "Corrente Russa", slug: "corrente-russa" },
      { name: "Detox Corporal", slug: "detox-corporal" },
      { name: "Drenagens Linfáticas", slug: "drenagens-linfaticas" },
    ],
  },
  {
    slug: "detox-corporal",
    name: "Detox Corporal",
    category: "SPA & Bem-estar",
    image: SERVICO_3_URL_LOCAL,
    short: "Eliminação de toxinas e revitalização de todo o organismo.",
    intro:
      "O detox corporal é fundamental para manter saúde, disposição e beleza da pele. A rotina agitada e a alimentação pouco equilibrada favorecem o acúmulo de toxinas — o detox atua nesse ciclo, promovendo desintoxicação e sensação de leveza.",
    what:
      "Na SPA LUNAR, combinamos técnicas como massagens, drenagens e envoltórios corporais para potencializar os resultados. É indicado para homens e mulheres em busca de bem-estar e melhora estética de forma natural e não invasiva.",
    benefits: [
      "Eliminação de toxinas e impurezas",
      "Estímulo da circulação sanguínea",
      "Redução de líquidos retidos",
      "Melhora da elasticidade da pele",
      "Sensação de leveza e bem-estar",
    ],
    why:
      "Ambiente acolhedor, protocolos personalizados e uma equipe atenta a cada detalhe do seu processo.",
    related: [
      { name: "Drenagens Linfáticas", slug: "drenagens-linfaticas" },
      { name: "Corrente Russa", slug: "corrente-russa" },
      { name: "Criolipólise", slug: "criolipolise" },
    ],
  },
  {
    slug: "drenagens-linfaticas",
    name: "Drenagens Linfáticas",
    category: "SPA & Bem-estar",
    image: SERVICO_3_URL_LOCAL,
    short: "Massagem manual que reduz inchaço e ativa a circulação.",
    intro:
      "A drenagem linfática é uma massagem manual, suave e ritmada, que estimula o sistema linfático a eliminar toxinas e o excesso de líquidos. Vai além da estética: melhora a circulação, reduz a retenção e proporciona relaxamento profundo.",
    what:
      "Indicada para homens e mulheres, pode integrar processos pós-operatórios, tratamentos de rejuvenescimento ou compor a sua rotina de bem-estar.",
    benefits: [
      "Redução da retenção de líquidos",
      "Melhora da circulação sanguínea",
      "Combate à celulite",
      "Eliminação de toxinas",
      "Relaxamento corporal profundo",
    ],
    why:
      "Profissionais qualificados, atendimento personalizado e um ambiente pensado para você desacelerar.",
    related: [
      { name: "Detox Corporal", slug: "detox-corporal" },
      { name: "Corrente Russa", slug: "corrente-russa" },
      { name: "Criolipólise", slug: "criolipolise" },
    ],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
