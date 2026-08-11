import { coffees } from '@/data/coffees';

export interface AtlasCountry {
  slug: string;
  name: string;
  flag: string;
  region: string;
  coordinates: { left: string; top: string };
  eyebrow: string;
  tagline: string;
  story: string;
  fieldNote: string;
  climate: string;
  elevation: string;
  harvest: string;
  coffeeIds: string[];
  heroImage?: string;
  history?: string;
  coffeeCulture?: string;
  funFacts?: string[];
  galleryImages?: string[];
}

export const atlasCountries: AtlasCountry[] = [
  {
    slug: 'ethiopia',
    name: 'Ethiopia',
    flag: 'ET',
    region: 'East Africa',
    coordinates: { left: '52%', top: '49%' },
    eyebrow: 'The birthplace of coffee',
    tagline: 'Floral, bright, and rooted in ceremony.',
    story:
      'In the highlands of Ethiopia, coffee grows among wild forests and family gardens. A cup is an invitation to slow down: beans are roasted over a small flame, ground by hand, and brewed three times for the people gathered around it.',
    fieldNote:
      'Look for jasmine, bergamot, stone fruit, and a tea-like finish in coffees from the southern highlands.',
    climate: 'Cool highland mornings',
    elevation: '1,500–2,200 m',
    harvest: 'November–February',
    coffeeIds: ['espresso'],
  },
  {
    slug: 'colombia',
    name: 'Colombia',
    flag: 'CO',
    region: 'South America',
    coordinates: { left: '27%', top: '57%' },
    eyebrow: 'Three mountain ranges',
    tagline: 'Silky sweetness from steep, green valleys.',
    story:
      'Coffee in Colombia follows the folds of the Andes. Smallholder farms climb above the clouds, where careful picking and slow drying bring out the cocoa, red fruit, and caramel notes that make Colombian coffees feel immediately familiar.',
    fieldNote:
      'A clean, sweet cup with red apple acidity and panela-like sweetness is a classic Colombian signature.',
    climate: 'Equatorial mountain rain',
    elevation: '1,200–2,000 m',
    harvest: 'September–December',
    coffeeIds: ['cortado', 'americano'],
  },
  {
    slug: 'brazil',
    name: 'Brazil',
    flag: 'BR',
    region: 'South America',
    coordinates: { left: '37%', top: '67%' },
    eyebrow: 'A country of immense scale',
    tagline: 'Chocolate, nuts, and a generous body.',
    story:
      'Brazil is the world’s largest coffee-growing country, stretching from rolling cerrado savannah to lush Atlantic hills. Natural processing—drying the coffee cherry whole—often gives the cup a round, syrupy texture and a warm, unmistakable sweetness.',
    fieldNote:
      'Try a Brazilian natural when you want hazelnut, milk chocolate, dried fruit, and a soft acidity.',
    climate: 'Warm days, marked dry season',
    elevation: '800–1,300 m',
    harvest: 'May–September',
    coffeeIds: ['cappuccino', 'mocha'],
  },
  {
    slug: 'italy',
    name: 'Italy',
    flag: 'IT',
    region: 'Southern Europe',
    coordinates: { left: '52%', top: '28%' },
    eyebrow: 'The ritual, refined',
    tagline: 'A short pause, pulled with confidence.',
    story:
      'Italy did not grow coffee, but it shaped the modern ritual around it. From the first espresso bars to the standing counter, Italian coffee culture prizes precision, sociability, and a drink small enough to leave room for the rest of the day.',
    fieldNote:
      'The best espresso is not a destination; it is a punctuation mark between one human moment and the next.',
    climate: 'Mediterranean coastal air',
    elevation: 'Roasted and blended locally',
    harvest: 'Year-round roasting',
    coffeeIds: ['espresso', 'latte', 'cappuccino', 'affogato', 'macchiato'],
  },
  {
    slug: 'japan',
    name: 'Japan',
    flag: 'JP',
    region: 'East Asia',
    coordinates: { left: '84%', top: '40%' },
    eyebrow: 'Patience, poured',
    tagline: 'Clarity and craft in every slow drip.',
    story:
      'Japan’s coffee story is one of attentive adaptation. Kissaten cafés made dark, careful roasting and hand-poured coffee part of daily life; today, the country’s quiet precision can be felt in everything from siphon brewing to a glass of cold brew.',
    fieldNote:
      'Cold brew became a Japanese café classic through patience: a slow drip, a clear glass, and time doing the work.',
    climate: 'Humid islands, distinct seasons',
    elevation: 'Café craft rather than cultivation',
    harvest: 'Seasonal menu rhythm',
    coffeeIds: ['cold-brew'],
  },
  {
    slug: 'vietnam',
    name: 'Vietnam',
    flag: 'VN',
    region: 'Southeast Asia',
    coordinates: { left: '77%', top: '54%' },
    eyebrow: 'Slow drip, strong spirit',
    tagline: 'Robusta, condensed milk, and heat.',
    story:
      'Vietnam’s phin filter turns coffee into a small performance. Dark-roasted Robusta drips patiently onto condensed milk, then meets a glass full of ice—a sweet, powerful answer to hot afternoons and long conversations.',
    fieldNote:
      'The phin is part brewer, part timer. Let the first drops fall slowly before the full stream begins.',
    climate: 'Tropical monsoon',
    elevation: '500–1,500 m',
    harvest: 'October–April',
    coffeeIds: ['vietnamese-iced-coffee'],
  },
  {
    slug: 'australia',
    name: 'Australia',
    flag: 'AU',
    region: 'Oceania',
    coordinates: { left: '87%', top: '78%' },
    eyebrow: 'A new coffee language',
    tagline: 'The flat white, made singular.',
    story:
      'Australia’s café culture turned coffee into a daily design language: neighborhood-led, exacting, and deeply social. The flat white emerged from that conversation, balancing a short, intense espresso with a fine veil of textured milk.',
    fieldNote:
      'A good flat white has no foam mountain—just a glossy surface and an espresso presence that stays through the milk.',
    climate: 'Subtropical coastal light',
    elevation: 'Café craft rather than cultivation',
    harvest: 'Seasonal menu rhythm',
    coffeeIds: ['flat-white', 'iced-latte'],
  },
  {
    slug: 'turkey',
    name: 'Turkey',
    flag: 'TR',
    region: 'Western Asia',
    coordinates: { left: '59%', top: '37%' },
    eyebrow: 'Coffee, slowly prepared',
    tagline: 'Unfiltered, aromatic, and deeply social.',
    story:
      'Turkish coffee is prepared in a cezve, where finely ground coffee, water, and sometimes sugar come together over gentle heat. The unfiltered cup is small, fragrant, and made for conversation.',
    fieldNote: 'Let the grounds settle before the first sip; the pause is part of the ritual.',
    climate: 'Mediterranean and continental',
    elevation: 'Café craft rather than cultivation',
    harvest: 'Year-round roasting',
    coffeeIds: ['espresso'],
  },
  {
    slug: 'france',
    name: 'France',
    flag: 'FR',
    region: 'Western Europe',
    coordinates: { left: '49%', top: '29%' },
    eyebrow: 'The café as a room',
    tagline: 'A morning ritual with a view of the street.',
    story:
      'In France, coffee belongs to the rhythm of the day: a small cup at the counter, a café crème at a sunny table, and enough time to watch the city pass by.',
    fieldNote: 'The setting matters as much as the roast: linger, observe, and let the cup set the pace.',
    climate: 'Temperate coastal air',
    elevation: 'Café craft rather than cultivation',
    harvest: 'Seasonal menu rhythm',
    coffeeIds: ['latte'],
  },
  {
    slug: 'mexico',
    name: 'Mexico',
    flag: 'MX',
    region: 'Central America',
    coordinates: { left: '16%', top: '54%' },
    eyebrow: 'Cinnamon, clay, and warmth',
    tagline: 'Bright highland beans with a generous welcome.',
    story:
      'Mexico’s coffee grows in misty southern highlands and appears in kitchens and cafés as a bright, comforting daily brew. Café de olla adds cinnamon and piloncillo to the pot.',
    fieldNote: 'Look for brown sugar, citrus, and gentle spice in coffees from Chiapas and Oaxaca.',
    climate: 'Warm highland rain',
    elevation: '900–1,700 m',
    harvest: 'November–March',
    coffeeIds: ['americano', 'cold-brew'],
  },
];

export function getAtlasCountry(slug: string | undefined) {
  return atlasCountries.find(country => country.slug === slug);
}

export function getCountryCoffees(country: AtlasCountry) {
  return country.coffeeIds
    .map(id => coffees.find(coffee => coffee.id === id))
    .filter((coffee): coffee is (typeof coffees)[number] => Boolean(coffee));
}

export function getCountryForCoffee(coffeeId: string) {
  return atlasCountries.find(country => country.coffeeIds.includes(coffeeId));
}