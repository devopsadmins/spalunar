import { cleanPageTitle, loadPagesMap, loadSiteIndex, splitMainText } from './site-data';

export const CLINIC = {
    name: 'SPA LUNAR Clinica Evelin Oliveira',
    whatsappUrl:
        'https://wa.me/5511959939701?text=Ola%2C%20gostaria%20de%20agendar%20uma%20avaliacao%20no%20SPA%20LUNAR.',
    instagramUrl: 'https://www.instagram.com/spalunaresteticaevelinoliveira',
    phoneHref: 'tel:+5511959939701',
    phoneDisplay: '(11) 95993-9701',
    email: 'hevelynestetica@yahoo.com.br',
    address: {
        street: 'Rua David Ben Gurion, 412 - Piso Superior',
        neighborhood: 'Morumbi',
        city: 'Sao Paulo - SP',
        zip: '05634-001',
    },
};

export const CORE_SERVICE_SLUGS = [
    'corrente-russa',
    'criolipolise',
    'detox-corporal',
    'drenagens-linfaticas',
] as const;

export const TESTIMONIALS = [
    {
        name: 'Melissa Pontes',
        text: 'Experiencia incrivel no atendimento e nos protocolos. Ambiente seguro, acolhedor e com resultados visiveis.',
    },
    {
        name: 'Ieda Brandao',
        text: 'Fiz Criolipolise e fiquei muito satisfeita com o resultado. Equipe atenciosa e cuidado impecavel.',
    },
    {
        name: 'Rozana Ventura',
        text: 'Tratamentos personalizados e profissionais excelentes. Sempre encontro acolhimento e orientacao clara.',
    },
    {
        name: 'Eva Carvalho',
        text: 'Do atendimento aos servicos, tudo com alto padrao. Um verdadeiro momento de bem-estar e autocuidado.',
    },
];

export type ServiceCard = {
    slug: string;
    title: string;
    short: string;
    summary: string;
    image: string | null;
    related: Array<{ slug: string; title: string }>;
};

export function getHeroImage(): string | null {
    const pages = loadPagesMap();
    const home = pages.home;
    return home?.images?.find((img) => img.local_path)?.local_path || null;
}

export function getServiceCards(): ServiceCard[] {
    const pages = loadPagesMap();
    const index = loadSiteIndex();

    return CORE_SERVICE_SLUGS.map((slug) => {
        const page = pages[slug];
        const title = cleanPageTitle(page?.title || slug);
        const summary = splitMainText(page?.main_text || '').find((line) => line.length > 90) || page?.meta_description || '';
        const image = page?.images?.find((img) => img.local_path)?.local_path || null;

        const related = index.paginas
            .filter((item) => item.slug !== slug && item.slug.startsWith(slug.split('-')[0]))
            .slice(0, 3)
            .map((item) => ({
                slug: item.slug,
                title: cleanPageTitle(item.titulo || item.slug),
            }));

        return {
            slug,
            title,
            short: page?.meta_description || 'Tratamento personalizado com foco em resultado e bem-estar.',
            summary,
            image,
            related,
        };
    });
}

export function getServiceBySlug(slug: string): ServiceCard | null {
    return getServiceCards().find((item) => item.slug === slug) || null;
}
