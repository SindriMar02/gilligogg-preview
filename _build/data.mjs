/* ═══════════════════════════════════════════════════════════════════════════
   GILLIGOGG — content source of truth.

   EVERY string here is either (a) taken verbatim from the client's own
   published material, or (b) written by us and marked. Nothing is invented
   about the business.

   PRIMARY SOURCES
   ---------------
   • Drinks, wine, bubbles, prices  — gilligogg.com/menu, the 7-page beverage
     PDF published as images (Webflow asset ids 693332…, uploaded Dec 2025).
     Read page by page and transcribed. Their own spelling errors are
     corrected here and listed in CORRECTIONS below, with the evidence.
   • Hours + e-mail                  — gilligogg.com (inside the Opening Hours
     modal; not present in the page's own body text).
   • Address, opened June 2024       — gilligogg.com meta description +
     midborgin.is/gilligogg.
   • The name                        — Morgunblaðið 8 Sept 1965
     (timarit.is/page/1368841); Kjarval coined "gillígogg" and called it pure
     Icelandic though he made it up. Also the title of a compilation of
     Kjarval sources on skemman.is.
   • The four paintings              — Morgunblaðið 25 July 2024, "Óræð fortíð
     í bæjarmyndum Þrándar" (grein_id 1867271).
   • Þrándur Þórarinsson             — b. Akureyri 1978; is.wikipedia +
     Reykjavík Grapevine 26 July 2018.

   NOT CLAIMED ANYWHERE ON THE PAGE
   --------------------------------
   • Any staff name, count or bio — we have none. The crew rail ships as
     labelled empty slots, not as invented people.
   • Any turnover, award or ranking.
   • Any capacity, table count or booking policy.
   ═════════════════════════════════════════════════════════════════════════ */

export const biz = {
  name: 'Gilligogg',
  street: 'Austurstræti 12A',
  postal: '101',
  city: 'Reykjavík',
  email: 'gilligogg@gilligogg.com',
  site: 'https://www.gilligogg.com',
  instagram: 'gilligogg',
  opened: 'June 2024',
  happyHour: '16:00 – 19:00, every day',
  hours: [
    ['Mon', '14:00', '01:00'],
    ['Tue', '14:00', '01:00'],
    ['Wed', '14:00', '01:00'],
    ['Thu', '14:00', '01:00'],
    ['Fri', '12:00', '03:00'],
    ['Sat', '12:00', '03:00'],
    ['Sun', '12:00', '23:00']
  ]
};

/* Their printed menu's own errors. Every correction is evidenced, never guessed
   — the same rule Jungle's build used for "wierd" / "Bellpepper".            */
export const CORRECTIONS = [
  ['Amontilado sherry', 'Amontillado sherry', 'spelling'],
  ['Friuli-Venezia Giula', 'Friuli-Venezia Giulia', 'spelling'],
  ['Trentino - Aldo Adige', 'Trentino-Alto Adige', 'spelling'],
  ['Mourvedré', 'Mourvèdre', 'spelling'],
  ['Maison Champy — France, Pinot Noir', 'France, Burgundy',
   'their own bottle page lists the same wine as France, Burgundy — the house-wine page repeats the grape in the region field'],
  ['Segura Viudad Reserva', 'Segura Viudas Reserva', 'spelling'],
  ['Spain, Peredes', 'Spain, Penedès', 'spelling'],
  ['Cremant de Bourgne', 'Crémant de Bourgogne', 'spelling'],
  ['Willm Crémant d’Alsace Rosé — France, Burgundy', 'France, Alsace',
   'the wine’s own name says Alsace; Burgundy is a different region'],
  ['Möet Chandon Rosé', 'Moët & Chandon Rosé', 'spelling'],
  ['Dom Perignon', 'Dom Pérignon', 'spelling']
];

/* Illustrative ingredient colours. Stated as illustrative on the page, exactly
   as Jungle's band colours were.                                            */
const C = {
  rum:'#A9743C', gin:'#DDE4DA', vodka:'#E7EAE4', whiskey:'#B5772F', pisco:'#E3E7DC',
  brennivin:'#DCE3D4', amaro:'#7E3220', vermouth:'#B4713F', sherry:'#B07434',
  aperol:'#E4622A', campari:'#C0202B', sarti:'#E06A86', limoncello:'#EBC53C',
  stgermain:'#E3DFA8', prosecco:'#EDE2B4', sparkling:'#EDE6C4', cointreau:'#E1A24E',
  amaretto:'#9A5A2C', sake:'#E9E4CE',
  lime:'#8FBE3A', lemon:'#E9D451', orange:'#E28B2A', grapefruit:'#E1745A',
  pineapple:'#E6B93A', strawberry:'#C93A4A', cherry:'#A8202F', banana:'#E5CE62',
  plum:'#7B3557', grape:'#8E6FA8', apple:'#B9CE55', pear:'#D7D688',
  pistachio:'#9DBE6B', hazelnut:'#9A6636', almond:'#D9C4A0',
  jasmine:'#EFE7CE', elderflower:'#E7E4BC', sage:'#93A87C', basil:'#6E9C43',
  rhubarb:'#CF5A55', tea:'#B08A45', miso:'#8A5A22', whey:'#EDE8D8',
  balsamico:'#4A2A1E', spice:'#B4632A', soda:'#DCE6E6', tonic:'#DDE7E4',
  cream:'#EFE7D4', icecream:'#E9E0C6', lollipop:'#D9558E', borabora:'#E0C25C',
  bitter:'#B23A2A', boracream:'#EFE7D4'
};

/* ── the eight signatures ───────────────────────────────────────────────────
   name / ingredients / their own descriptor / price, verbatim from the sheet.
   `long` comes straight from their descriptor's first word, which is why the
   glass is derived rather than chosen.                                     */
export const signatures = [
  { n:'Pistachio', d:'Short, silky, sweet', p:'3.200',
    ing:[['Pineapple Rum',C.rum],['Cointreau',C.cointreau],['Lime',C.lime],['Pistachio Ice Cream',C.pistachio]] },
  { n:'Barbara', d:'Short, sour, smooth', p:'3.200',
    ing:[['Coconut oil washed Brennivín',C.brennivin],['Rhubarb',C.rhubarb],['Sage',C.sage],['Vermouth',C.vermouth]] },
  { n:'Sugar Plum Fairy', d:'Short, herbal, fruit', p:'3.200',
    ing:[['Amaro Montenegro',C.amaro],['Singleton 12',C.whiskey],['Plum Saké',C.sake],['Plums',C.plum]] },
  { n:'Miso Nuts', d:'Short, nutty, savoury', p:'3.400',
    ing:[['Monkey Shoulder Whiskey',C.whiskey],['Miso',C.miso],['Hazelnuts',C.hazelnut],['Amontillado sherry',C.sherry]] },
  { n:'Got Any Grapes?', d:'Long, fizzy, herbal', p:'3.100',
    ing:[['Vodka',C.vodka],['Tea',C.tea],['Pisco',C.pisco],['Grapes',C.grape],['Soda',C.soda]] },
  { n:'Candy Man', d:'Long, sweet, fizzy', p:'3.100',
    ing:[['Vodka',C.vodka],['Amaretto',C.amaretto],['Banana',C.banana],['Cherries',C.cherry],['Soda',C.soda],['Lollipop',C.lollipop]] },
  { n:'Garpur!', d:'Short, fresh, fruity', p:'3.200',
    ing:[['Banana Rum',C.rum],['Strawberries',C.strawberry],['Whey',C.whey],['Balsamico',C.balsamico],['Lime',C.lime]] },
  { n:'Jasmine Gimlet', d:'Short, floral, creamy', p:'3.200',
    ing:[['Gin',C.gin],['Jasmine',C.jasmine],['Lemon',C.lemon],['Bora Bora',C.borabora],['Clarified with vegan cream',C.cream]] }
];

export const spritzes = {
  price:'2.650',
  items:[
    { n:'Aperol Spritz',     ing:[['Aperol',C.aperol],['Prosecco',C.prosecco],['Orange',C.orange]] },
    { n:'Hugo Spritz',       ing:[['St. Germain',C.stgermain],['Prosecco',C.prosecco],['Lemon',C.lemon]] },
    { n:'Pink Sarti Spritz', ing:[['Sarti',C.sarti],['Prosecco',C.prosecco],['Lime',C.lime]] },
    { n:'Limoncello Spritz', ing:[['Limoncello',C.limoncello],['Prosecco',C.prosecco],['Lemon',C.lemon]] },
    { n:'Campari Spritz',    ing:[['Campari',C.campari],['Prosecco',C.prosecco],['Orange',C.orange]] }
  ]
};

export const mocktails = {
  price:'1.500',
  items:[
    { n:'Basil & Grape', ing:[['Basil',C.basil],['Grapefruit Soda',C.grapefruit]] },
    { n:'Paloma 0%!',    note:'Can be made spicy', ing:[['Grapefruit',C.grapefruit],['Spices',C.spice],['Soda',C.soda]] },
    { n:'Sbagliato 0%',  ing:[['Bitter',C.bitter],['Amaro',C.amaro],['Sparkling wine',C.sparkling]] },
    { n:'Feel the Fall', ing:[['Elderflower',C.elderflower],['Apples',C.apple],['Pears',C.pear],['Tonic / Soda',C.tonic]] }
  ]
};

/* Their own classics taxonomy — grouped by METHOD, which is where the glass
   shapes come from. Straight off the sheet, one price per group.           */
export const classics = [
  { group:'Highballs', glass:'highball', price:'3.000',
    items:['Tom Collins','Moscow Mule','Gin Fizz','Dark & Stormy','Paloma'] },
  { group:'Stirred', glass:'rocks', price:'3.400',
    items:['French 75','Martini','Negroni','Old Fashioned','Boulevardier','Manhattan','Rosita','Sazerac'] },
  { group:'Shaken', glass:'coupe', price:'3.200',
    items:['Espresso Martini','Cosmopolitan','Basil Gimlet','Whiskey Sour','Jungle Bird','Daiquiri','Margarita','Sidecar','Pisco Sour'] }
];

export const wine = {
  house: {
    white: [
      ['Pizzolato','Pinot Grigio','Italy, Friuli-Venezia Giulia','2.000','9.500'],
      ['Michel Lynch','Sauvignon Blanc','France, Bordeaux','2.300','11.000'],
      ['Laroche Chablis','Chardonnay','France','2.600','12.500'],
      ['Pian del Griso','Pinot Grigio','Italy, Trentino-Alto Adige','2.600','12.500']
    ],
    red: [
      ['Cazes Côtes du Rhône Reserva','Syrah, Grenache, Mourvèdre','France, Rhône','2.100','10.000'],
      ['Verona Bolla','Rosso Blend','Italy, Veneto','2.300','11.000'],
      ['Ramon Bilbao','Garnacha','Spain','2.500','12.000'],
      ['Maison Champy','Pinot Noir','France, Burgundy','2.800','13.500']
    ],
    rose: [
      ['Muga Rosado','Garnacha, Viura','Spain, Rioja','2.000','9.500']
    ]
  },
  bottles: {
    white: [
      ['Vietti Roero','Arneis','Italy, Piedmont','12.000'],
      ['Casa Rojo El Gordo del Circo','Verdejo','Spain, Rueda','11.500'],
      ['Louis Jadot Chablis Grand Cru','Chardonnay','France, Chablis','21.000']
    ],
    rose: [
      ['Muga Rosado','Garnacha, Viura','Spain, Rioja','9.500'],
      ['Torre Mora Scalunaro Etna Rosato','Nerello Mascalese','Italy, Sicily','11.000']
    ],
    red: [
      ['Amalaya Corte Único','Cabernet Franc, Malbec, Tannat','Argentina, Salta','12.500'],
      ['Maison Champy','Pinot Noir','France, Burgundy','14.500'],
      ['Enzo Bartoli Barolo','Nebbiolo','Italy, Piedmont','15.500'],
      ['Viña Ardanza','Tempranillo, Garnacha','Spain, Rioja','15.500'],
      ['Numanthia','Tinta de Toro','Spain, Toro','19.500'],
      ["Penfold's Bin 28 Kalimna",'Shiraz','South Australia','16.500'],
      ['Beringer Private Reserve','Cabernet Sauvignon','California, Napa Valley','45.000']
    ]
  },
  bubbles: {
    glass: [
      ['Pizzolato 0%','','Italy, Veneto','1.500',''],
      ['Segura Viudas Reserva Brut Cava','','Spain, Penedès','1.900','10.500'],
      ['Piccini Prosecco','','Italy, Veneto','1.900',''],
      ['François Martenot Crémant de Bourgogne Brut','','France, Bourgogne','2.100',''],
      ['Pol Roger','','France, Champagne','3.300','19.000']
    ],
    bottles: [
      ["Willm Crémant d'Alsace Rosé",'','France, Alsace','12.000'],
      ['Crémant de Bourgogne','','France, Bourgogne','12.000'],
      ['Moët & Chandon Rosé','','France, Champagne','20.500'],
      ['Vollereaux Brut Blanc de Blancs','','France, Champagne','21.000'],
      ['Dom Pérignon','','France, Champagne','60.000']
    ]
  }
};

/* Photographs — the client's own, from their Webflow CDN. Captions describe
   only what is visibly in the frame.                                       */
export const photos = {
  bar:      { src:'assets/img/room1.webp', w:2000, h:1334,
              alt:'The curved bar at Gilligogg, brass rail and green tufted leather stools, bottles on the back shelf, with a large painted mural filling the wall behind.' },
  through:  { src:'assets/img/room2.webp', w:2000, h:1334,
              alt:'Looking down the room toward the street doors, the bar on the right, brass foot rail and gold stools, herringbone parquet underfoot.' },
  outside:  { src:'assets/img/room3.webp', w:2000, h:1334,
              alt:'The Austurstræti frontage, with bentwood chairs and round tables set out on the pavement terrace in front of the open doors.' },
  corner:   { src:'assets/img/room4.webp', w:2000, h:1333,
              alt:'A corner of the room with brown leather tub armchairs beneath a large dark painting of classical figures.' },
  painting: { src:'assets/img/room5.webp', w:2000, h:1333,
              alt:'A long painted panel above the banquette showing a crowded green square in Reykjavík, with amber table lamps lit along the seating below.' }
};
