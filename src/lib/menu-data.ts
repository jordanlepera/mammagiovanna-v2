import type { Locale } from '@/i18n/routing';

/**
 * Typed menu data — extracted verbatim from the v1 site (pages/menu.js).
 * Names/descriptions resolve through translation keys (all 4 locales);
 * prices and sizes are locale-independent numbers.
 */

export interface MenuItem {
  /** translation key in the `menu` namespace */
  key?: string;
  /** literal (untranslated) name, e.g. wine labels */
  name?: string;
  /** translation key for the ingredient/description line */
  ing?: string;
  price?: number;
  /** discounted price shown in red beside the crossed-out original */
  discount?: number;
  /** serving size, e.g. '75cl' */
  capacity?: string;
  /** nested translation keys (e.g. sauce choices under pasta) */
  children?: string[];
}

export interface MenuSubsection {
  key: string;
  items: MenuItem[];
}

export interface MenuSection {
  /** stable id used for URL fragments + navigation */
  id: string;
  /** translation key of the section title */
  titleKey: string;
  items: MenuItem[];
  subsections: MenuSubsection[];
}

export interface WineByGlass {
  name: string;
  /** [12cl, 25cl, 50cl, 75cl] where offered; 0 = not offered */
  prices: [number, number, number, number];
}

const item = (i: MenuItem): MenuItem => i;
const subsection = (key: string, items: MenuItem[]): MenuSubsection => ({ key, items });

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: 'our-salade',
    titleKey: 'our-salade',
    items: [
      item({ key: 'bresaola', ing: 'bresaola-ing', price: 13.5 }),
      item({ key: 'etoile-chef', ing: 'etoile-chef-ing', price: 14.9 }),
      item({ key: 'salade', price: 3.5 }),
    ],
    subsections: [],
  },
  {
    id: 'planchette-apero',
    titleKey: 'planchette-apero',
    items: [],
    subsections: [],
  },
  {
    id: 'menu-piccolo',
    titleKey: 'menu-piccolo',
    items: [],
    subsections: [],
  },
  {
    id: 'pasta',
    titleKey: 'pasta',
    items: [
      item({
        key: 'pasta-kind',
        price: 12.9,
        children: ['pasta-sauce', 'bolognese', 'napolitana', 'carbonara'],
      }),
    ],
    subsections: [],
  },
  {
    id: 'italian-speciality',
    titleKey: 'italian-speciality',
    items: [
      item({ key: 'risotto-truffe', ing: 'risotto-truffe-ing', price: 18.5 }),
      item({ key: 'gnocchi-melanzane', ing: 'gnocchi-melanzane-ing', price: 14.5 }),
      item({ key: 'gnocchi-gorgonzola', ing: 'gnocchi-gorgonzola-ing', price: 14.5 }),
      item({ key: 'tagliatelle-pesto-burrata', ing: 'tagliatelle-pesto-burrata-ing', price: 14.5 }),
    ],
    subsections: [],
  },
  {
    id: 'meat-fish',
    titleKey: 'meat-fish',
    items: [
      item({ key: 'salmon', ing: 'salmon-ing', price: 18.0 }),
      item({ key: 'scaloppa-valdostana', ing: 'scaloppa-valdostana-ing', price: 22.0 }),
      item({ key: 'steak-forno', ing: 'steak-forno-ing', price: 21.0 }),
      item({ key: 'steak-forno-vitello', ing: 'steak-forno-vitello-ing', price: 21.0 }),
      item({ key: 'milanese', ing: 'milanese-ing', price: 21.0 }),
      item({ key: 'beef', ing: 'beef-ing', price: 19.5 }),
    ],
    subsections: [],
  },
  {
    id: 'dessert',
    titleKey: 'dessert',
    items: [
      item({ key: 'tiramisu', price: 6.8 }),
      item({ key: 'mousse', ing: 'mousse-ing', price: 6.8 }),
      item({ key: 'panna-cotta', ing: 'panna-cotta-ing', price: 6.8 }),
    ],
    subsections: [],
  },
  {
    id: 'our-ice-cream',
    titleKey: 'our-ice-cream',
    items: [
      item({ key: 'ice-cream-flavor', ing: 'ice-cream-flavor-ing' }),
      item({ key: '1-scoop', price: 2.5 }),
      item({ key: '2-scoop', price: 4.5 }),
      item({ key: '3-scoop', price: 6.0 }),
      item({ key: 'dame-blanche', ing: 'dame-blanche-ing', price: 6.8 }),
      item({ key: 'chocolat-liegeois', ing: 'chocolat-liegeois-ing', price: 6.8 }),
      item({ key: 'cafe-liegeois', ing: 'cafe-liegeois-ing', price: 6.8 }),
      item({ key: 'amarena', ing: 'amarena-ing', price: 7.0 }),
      item({ key: 'mojito', ing: 'mojito-ing', price: 8.0 }),
      item({ key: 'sorbet-arrose', price: 8.0 }),
    ],
    subsections: [],
  },
  {
    id: 'pizza',
    titleKey: 'pizza',
    items: [
      item({ key: '4formaggi', ing: '4formaggi-ing', price: 12.5 }),
      item({ key: 'pizza-steak', ing: 'pizza-steak-ing', price: 15.0 }),
      item({ key: 'pizza-steak-vitello', ing: 'pizza-steak-vitello-ing', price: 15.0 }),
      item({ key: 'diavola', ing: 'diavola-ing', price: 12.8 }),
      item({ key: 'siciliana', ing: 'siciliana-ing', price: 12.5 }),
      item({ key: 'mamma-giovanna', ing: 'mamma-giovanna-ing', price: 13.5 }),
      item({ key: 'hawaiana', ing: 'hawaiana-ing', price: 12.5 }),
      item({ key: 'fiorentina', ing: 'fiorentina-ing', price: 12.5 }),
      item({ key: 'capriciosa', ing: 'capriciosa-ing', price: 12.5 }),
      item({ key: 'margherita', ing: 'margherita-ing', price: 10.7 }),
      item({ key: '4stagioni', ing: '4stagioni-ing', price: 12.5 }),
      item({ key: 'bufala', ing: 'bufala-ing', price: 13.8 }),
      item({ key: 'napoletana', ing: 'napoletana-ing', price: 12.5 }),
      item({ key: 'vegetariana', ing: 'vegetariana-ing', price: 12.5 }),
      item({ key: '1000gusti', ing: '1000gusti-ing', price: 12.8 }),
      item({ key: 'parmigiana', ing: 'parmigiana-ing', price: 12.8 }),
      item({ key: 'calzone', ing: 'calzone-ing', price: 12.8 }),
    ],
    subsections: [],
  },
  {
    id: 'white-pizza',
    titleKey: 'white-pizza',
    items: [
      item({ key: 'burratina', ing: 'burratina-ing', price: 15.9 }),
      item({ key: 'chicken', ing: 'chicken-ing', price: 12.8 }),
      item({ key: 'white-bufala', ing: 'white-bufala-ing', price: 13.5 }),
    ],
    subsections: [],
  },
  {
    id: 'italian-wine',
    titleKey: 'italian-wine',
    items: [],
    subsections: [
      subsection('red-wine', [
        item({ name: 'Lambrusco DOC', price: 15.9, capacity: '75cl' }),
        item({ name: 'Primitivo Quota 29 IGT Menhir', price: 29.9, capacity: '75cl' }),
        item({ name: "Nero d'Avola Sicilia IGT", price: 21.0, capacity: '75cl' }),
        item({
          name: 'Negroamaro Illivia Salento IGT L. de Castris',
          price: 26.5,
          capacity: '75cl',
        }),
        item({ name: 'Valpolicella DOC D. V. Negrar', price: 13.9, capacity: '37,5cl' }),
        item({ name: 'Valpolicella DOC D. V. Negrar', price: 21.0, capacity: '75cl' }),
        item({ name: 'Barolo DOCG Beni di Batasiolo', price: 48.0, capacity: '75cl' }),
        item({ name: 'Chianti DOCG', price: 21.0, capacity: '75cl' }),
        item({ name: 'Montepulciano DOC', price: 24.9, capacity: '75cl' }),
      ]),
      subsection('white-wine', [
        item({ name: 'Gavi del Piemonte DOC Batasiolo', price: 26.0, capacity: '75cl' }),
      ]),
      subsection('rose-wine', [
        item({ name: 'Bardolino Chiar. DOC D. V. Negrar', price: 13.5, capacity: '37,5cl' }),
        item({ name: 'Bardolino Chiar. DOC D. V. Negrar', price: 21.0, capacity: '75cl' }),
      ]),
      subsection('pitcher-wine', []),
    ],
  },
  {
    id: 'french-wine',
    titleKey: 'french-wine',
    items: [],
    subsections: [
      subsection('selection-wine', [
        item({ name: 'Bordeaux Saint-Emilion AOC', price: 16.5, capacity: '37,5cl' }),
        item({ name: 'Bordeaux Saint-Emilion AOC', price: 29.9, capacity: '75cl' }),
        item({ name: 'Brouilly Briante AOC', price: 15.5, capacity: '37,5cl' }),
        item({ name: 'Brouilly Briante AOC', price: 25.5, capacity: '75cl' }),
        item({ name: 'Vacqueyras AOC', price: 25.0, capacity: '75cl' }),
      ]),
      subsection('alsacian-wine', []),
    ],
  },
  {
    id: 'drink',
    titleKey: 'drink',
    items: [],
    subsections: [
      subsection('aperitif', [
        item({ key: 'aperitif-maison', price: 4.9, capacity: '12cl' }),
        item({ key: 'pastis', price: 3.5, capacity: '2cl' }),
        item({ key: 'campari', price: 5.5, capacity: '4cl' }),
        item({ key: 'kir-royal', price: 6.5, capacity: '12cl' }),
        item({ key: 'alsacian-kir', price: 3.9, capacity: '12cl' }),
        item({ key: 'picon', price: 3.9, capacity: '25cl' }),
        item({ key: 'suze', price: 3.9, capacity: '4cl' }),
        item({ key: 'pelfort', price: 3.5, capacity: '25cl' }),
        item({ key: 'pelfort', price: 6.5, capacity: '50cl' }),
        item({ key: 'fischer', price: 3.9, capacity: '25cl' }),
        item({ key: 'fischer', price: 7.5, capacity: '50cl' }),
        item({ key: 'amer', price: 3.9, capacity: '25cl' }),
        item({ key: 'martini', price: 3.9, capacity: '4cl' }),
        item({ key: 'porto', price: 3.9, capacity: '4cl' }),
        item({ key: 'gin', price: 5.5, capacity: '4cl' }),
        item({ key: 'prosecco', price: 4.9, capacity: '12cl' }),
        item({ key: 'spritz', ing: 'spritz-ing', price: 6.8, capacity: '18cl' }),
        item({ key: 'whisky-coca', price: 6.9, capacity: '4cl' }),
        item({ key: 'vodka', price: 5.5, capacity: '4cl' }),
        item({ key: 'malibu', price: 5.5, capacity: '4cl' }),
      ]),
      subsection('digestive', [
        item({ key: 'vodka', price: 5.5, capacity: '4cl' }),
        item({ key: 'baby', price: 3.5, capacity: '2cl' }),
        item({ key: 'baileys', price: 5.5, capacity: '4cl' }),
        item({ key: 'rhum', price: 5.5, capacity: '4cl' }),
        item({ key: 'whisky-jb', price: 5.5, capacity: '4cl' }),
        item({ key: 'whisky-jack', price: 6.9, capacity: '4cl' }),
        item({ key: 'cognac', price: 6.5, capacity: '2cl' }),
        item({ key: 'eau-de-vie', ing: 'eau-de-vie-ing', price: 6.5, capacity: '2cl' }),
        item({ key: 'get27', price: 5.5, capacity: '4cl' }),
        item({ key: 'amaretto', price: 5.5, capacity: '4cl' }),
        item({ key: 'grappa', price: 6.0, capacity: '2cl' }),
        item({ key: 'sambuca', price: 5.5, capacity: '3cl' }),
        item({ key: 'limoncello', price: 5.5, capacity: '3cl' }),
      ]),
      subsection('soft-drink', [
        item({ key: 'lisbeth', price: 3.0, capacity: '50cl' }),
        item({ key: 'lisbeth', price: 4.5, capacity: '1L' }),
        item({ key: 'san-pellegrino', price: 3.5, capacity: '50cl' }),
        item({ key: 'san-pellegrino', price: 4.9, capacity: '1L' }),
        item({ key: 'perrier', price: 3.5, capacity: '33cl' }),
        item({ key: 'limonade', price: 2.5, capacity: '25cl' }),
        item({ key: 'pom-lisbeth', price: 3.5, capacity: '33cl' }),
        item({ key: 'coca', price: 3.5, capacity: '33cl' }),
        item({ key: 'orangina', price: 3.5, capacity: '33cl' }),
        item({ key: 'schweppes-tonic', price: 3.5, capacity: '20cl' }),
        item({ key: 'ice-tea', price: 3.5, capacity: '33cl' }),
        item({ key: 'cristalline', price: 2.9, capacity: '50cl' }),
        item({ key: 'moretti', price: 4.5, capacity: '33cl' }),
        item({ key: 'schweppes-agrumes', price: 3.5, capacity: '20cl' }),
        item({ key: 'syrups', price: 2.5, capacity: '25cl' }),
        item({ key: 'diabolo', price: 2.8, capacity: '25cl' }),
        item({ key: 'nectar', ing: 'nectar-ing', price: 3.5, capacity: '20cl' }),
      ]),
      subsection('hot-drink', [
        item({ key: 'coffee', price: 2.1 }),
        item({ key: 'coffee-cream', price: 2.2 }),
        item({ key: 'grand-coffee', price: 2.9 }),
        item({ key: 'grand-coffee-cream', price: 3.0 }),
        item({ key: 'coffee-chantilly', price: 3.5 }),
        item({ key: 'infusion', ing: 'infusion-ing', price: 2.9 }),
        item({ key: 'irish-coffee', price: 8.0 }),
        item({ key: 'italian-coffee', price: 8.0 }),
      ]),
    ],
  },
];
export const PITCHER_WINES: WineByGlass[] = [
  { name: 'Chianti DOC', prices: [3.8, 7.5, 14.0, 0.0] },
  { name: 'Lambrusco Amabile DOC', prices: [3.1, 6.0, 11.0, 0.0] },
  { name: "Rosé d\\'été", prices: [3.6, 6.9, 13.0, 18.0] },
  { name: 'Sélection du chef', prices: [4.9, 9.2, 17.0, 26.0] },
];

export const ALSACIAN_WINES: WineByGlass[] = [
  { name: 'Edelzwicker Gross', prices: [2.5, 4.5, 8.0, 0.0] },
  { name: 'Pinot Noir Bio Gross', prices: [4.1, 8.1, 14.9, 23.0] },
  { name: 'Pinot Gris Bio Gross', prices: [4.1, 8.1, 14.9, 23.0] },
  { name: 'Riesling Bio Gross', prices: [4.1, 8.1, 14.9, 23.0] },
  { name: 'Muscat Bio Gross', prices: [4.1, 8.1, 14.9, 23.0] },
  { name: 'Gewurtztraminer Bio Gross', prices: [4.1, 8.1, 14.9, 23.0] },
];

export function getSection(id: string): MenuSection | undefined {
  return MENU_SECTIONS.find((s) => s.id === id);
}

export function itemName(item: MenuItem, menu: Record<string, string>): string {
  if (item.key) {
    return menu[item.key] ?? item.key;
  }
  return item.name ?? '';
}

export function itemDesc(item: MenuItem, menu: Record<string, string>): string | undefined {
  if (!item.ing) return undefined;
  return menu[item.ing] ?? undefined;
}

export function formatPrice(price: number | undefined, locale: Locale): string {
  if (price === undefined) return '';
  const tag = locale === 'en' ? 'en-IE' : locale;
  return new Intl.NumberFormat(tag, {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}
