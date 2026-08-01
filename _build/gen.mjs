/* Emits index.html from _build/data.mjs.
   Run:  node _build/gen.mjs
   The site itself stays build-free — this just writes the file once, so the
   drink markup is DERIVED from the transcribed menu rather than hand-typed
   sixteen times (which is how a wrong price or a mismatched band creeps in). */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as D from './data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const n2 = i => String(i + 1).padStart(2, '0');

/* ── glassware ───────────────────────────────────────────────────────────────
   Five silhouettes. Which one a drink gets is DERIVED, never chosen by taste:
   the signatures follow their menu's own "Short" / "Long" descriptor, and the
   classics follow their own Highballs / Stirred / Shaken grouping.
   `top`/`bot` are the liquid column inside each silhouette, so every
   ingredient band lands somewhere visible instead of being clipped away. */
const GLASS = {
  coupe:    { top:36, bot:83,  d:'M14 34 Q14 78 46 84 L46 112 L30 118 L30 124 L70 124 L70 118 L54 112 L54 84 Q86 78 86 34 Z' },
  wine:     { top:34, bot:83,  d:'M22 30 Q22 76 46 84 L46 112 L32 118 L32 124 L68 124 L68 118 L54 112 L54 84 Q78 76 78 30 Z' },
  highball: { top:33, bot:122, d:'M18 30 L23 118 Q23 124 30 124 L70 124 Q77 124 77 118 L82 30 Z' },
  collins:  { top:23, bot:122, d:'M28 20 L31 118 Q31 124 38 124 L62 124 Q69 124 69 118 L72 20 Z' },
  rocks:    { top:59, bot:122, d:'M20 56 L24 118 Q24 124 31 124 L69 124 Q76 124 76 118 L80 56 Z' }
};

function glassSvg(kind, id, ing) {
  const g = GLASS[kind];
  const n = ing.length;
  const h = (g.bot - g.top) / n;
  const bands = ing.map(([, colour], i) => {
    const y = (g.bot - (i + 1) * h).toFixed(1);
    return `<rect class="gl__band" data-band="${i}" x="0" y="${y}" width="100" height="${(h + 0.6).toFixed(1)}" fill="${colour}"/>`;
  }).join('');
  return `<svg viewBox="0 0 100 130" class="gl" data-fill>
                <defs><clipPath id="cp-${id}"><path d="${g.d}"/></clipPath></defs>
                <g clip-path="url(#cp-${id})">${bands}</g>
                <path class="gl__out" d="${g.d}"/>
              </svg>`;
}

function dish(drink, kind, id, i, price) {
  const spec = drink.ing.map(([label, colour], k) =>
    `<li data-ing="${k}"><i style="--c:${colour}" aria-hidden="true"></i>${esc(label)}</li>`).join('');
  const note = drink.d || drink.note;
  return `          <li class="dish">
            <div class="dish__glass" aria-hidden="true">
              ${glassSvg(kind, id, drink.ing)}
            </div>
            <div class="dish__body">
              <p class="dish__top"><span class="dish__n mono">${n2(i)}</span><span class="dish__name">${esc(drink.n)}</span><span class="dish__rule" aria-hidden="true"></span><span class="dish__p mono">${esc(drink.p || price)}</span></p>
              ${note ? `<p class="dish__note">${esc(note)}</p>` : ''}
              <ul class="dish__spec">${spec}</ul>
            </div>
          </li>`;
}

function course(id, title, price, drinks, kindFor) {
  const items = drinks.map((dr, i) => dish(dr, kindFor(dr), `${id}-${i}`, i, price)).join('\n');
  return `      <section class="course" aria-labelledby="course-${id}">
        <header class="course__head">
          <h3 class="course__title" id="course-${id}">${esc(title)}</h3>
          <p class="course__price mono">${esc(price)} kr.</p>
        </header>
        <ul class="course__list">
${items}
        </ul>
      </section>`;
}

/* ── classics: their own method grouping, one small glass per group ──────── */
const classicsBlock = D.classics.map(g => {
  const gl = GLASS[g.glass];
  return `      <section class="method">
        <header class="method__head">
          <svg class="method__gl" viewBox="0 0 100 130" aria-hidden="true"><path d="${gl.d}"/></svg>
          <div>
            <h3 class="method__title">${esc(g.group)}</h3>
            <p class="method__price mono">${esc(g.price)} kr.</p>
          </div>
        </header>
        <ul class="method__list">${g.items.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      </section>`;
}).join('\n');

/* ── wine tables ─────────────────────────────────────────────────────────── */
const wineRows = rows => rows.map(r => {
  const [name, grape, region, a, b] = r;
  const price = b ? `${a} <span class="cw__slash">/</span> ${b}` : a;
  return `<li class="cw"><span class="cw__n">${esc(name)}</span>${grape ? `<span class="cw__g">${esc(grape)}</span>` : ''}<span class="cw__r">${esc(region)}</span><span class="cw__rule" aria-hidden="true"></span><span class="cw__p mono">${price}</span></li>`;
}).join('');

const wineBlock = `
      <div class="cellar__col">
        <h3 class="cellar__h">By the glass</h3>
        <p class="cellar__sub mono">GLASS / BOTTLE</p>
        <h4 class="cellar__cat">White</h4><ul class="cellar__list">${wineRows(D.wine.house.white)}</ul>
        <h4 class="cellar__cat">Red</h4><ul class="cellar__list">${wineRows(D.wine.house.red)}</ul>
        <h4 class="cellar__cat">Rosé</h4><ul class="cellar__list">${wineRows(D.wine.house.rose)}</ul>
        <h4 class="cellar__cat">Bubbles</h4><ul class="cellar__list">${wineRows(D.wine.bubbles.glass)}</ul>
      </div>
      <div class="cellar__col">
        <h3 class="cellar__h">By the bottle</h3>
        <p class="cellar__sub mono">BOTTLE</p>
        <h4 class="cellar__cat">White</h4><ul class="cellar__list">${wineRows(D.wine.bottles.white)}</ul>
        <h4 class="cellar__cat">Red</h4><ul class="cellar__list">${wineRows(D.wine.bottles.red)}</ul>
        <h4 class="cellar__cat">Rosé</h4><ul class="cellar__list">${wineRows(D.wine.bottles.rose)}</ul>
        <h4 class="cellar__cat">Bubbles</h4><ul class="cellar__list">${wineRows(D.wine.bubbles.bottles)}</ul>
      </div>`;

/* ── the crew rail ───────────────────────────────────────────────────────────
   Eight slots, deliberately EMPTY. We have no staff names, photographs or
   bios, and the one thing this build will not do is invent people. Each card
   states plainly what belongs there, so the section reads as a brief to the
   client rather than as filler. Same rule as Jungle's "no photograph on
   file" drink panels. */
const CREW_SLOTS = [
  'Bartender', 'Bartender', 'Bartender', 'Bar back',
  'Bartender', 'Floor', 'Bartender', 'Bar manager'
];
const crewBlock = CREW_SLOTS.map((role, i) => `        <li class="crew__card crew__card--empty">
          <div class="crew__slot" aria-hidden="true"><span class="crew__slotn mono">${n2(i)}</span></div>
          <div class="crew__body">
            <h3>${esc(role)}</h3>
            <p class="crew__await mono">PORTRAIT + FIRST NAME TO COME</p>
          </div>
        </li>`).join('\n');

/* The landing is their wordmark, huge and centred, with the meaning of the word
   set small underneath it. The <h1>'s accessible name is therefore
   "Gilligogg A made-up word for everything good" — the img alt carries the
   name, the tag carries the phrase, so the page still says what it is. */
const HERO_TAG = 'A made-up word for everything good';

const hoursRows = D.biz.hours.map(([d, a, b]) =>
  `<li${d === 'Fri' || d === 'Sat' ? ' class="hrs--late"' : ''}><span class="hrs__d mono">${d}</span><span class="hrs__t mono">${a} – ${b}</span></li>`).join('');

const P = D.photos;
const fig = (k, cap, cls = '') => `  <figure class="bleed ${cls}" data-pour>
    <img src="${P[k].src}" alt="${esc(P[k].alt)}" width="${P[k].w}" height="${P[k].h}" loading="lazy" decoding="async" />
    <figcaption class="mono">${esc(cap)}</figcaption>
  </figure>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Gilligogg &middot; Cocktail bar, Austurstræti 12A, Reykjavík</title>
<meta name="description" content="A cocktail bar on Austurstræti, facing Austurvöllur. Eight signature cocktails, twenty-two classics grouped by method, wine and bubbles, and happy hour 16 to 19 every day. Named after a word Kjarval made up." />
<meta name="robots" content="noindex" />
<meta name="theme-color" content="#0C0A09" />

<meta property="og:type" content="website" />
<meta property="og:title" content="Gilligogg &middot; Austurstræti 12A, Reykjavík" />
<meta property="og:description" content="Kjarval's word for everything good. Eight signature cocktails, a room hung with four paintings of a Reykjavík that never existed, and happy hour every day from 16." />
<meta property="og:image" content="${P.bar.src}" />
<meta property="og:locale" content="en_GB" />

<link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="assets/favicon-48.png" type="image/png" sizes="48x48" />
<link rel="icon" href="assets/favicon-32.png" type="image/png" sizes="32x32" />
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png" />
<link rel="preload" href="assets/fonts/Caprasimo-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="assets/fonts/Switzer-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" as="image" href="${P.bar.src}" />
<link rel="stylesheet" href="styles.css" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  "name": "Gilligogg",
  "url": "${D.biz.site}",
  "email": "${D.biz.email}",
  "servesCuisine": "Cocktails",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "${D.biz.street}",
    "postalCode": "${D.biz.postal}",
    "addressLocality": "${D.biz.city}",
    "addressCountry": "IS"
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday"], "opens": "14:00", "closes": "01:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Friday","Saturday"], "opens": "12:00", "closes": "03:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Sunday"], "opens": "12:00", "closes": "23:00" }
  ]
}
</script>
</head>
<body>

<a class="skip" href="#main">Skip to content</a>

<!-- ══════════ opening scene ══════════
     Their gold rises behind the wordmark and drains away. Kjarval shouted the
     word coming down the hill; the page says it once before the room appears. -->
<div class="gate" id="gate">
  <svg class="gate__liquid" id="gateLiquid" viewBox="0 0 1200 1000" preserveAspectRatio="none" aria-hidden="true">
    <path id="gateWave" fill="#AE9E56" d="M0,1000 L0,1000 Q300,1000 600,1000 T1200,1000 L1200,1000 Z"/>
  </svg>
  <!-- This stage is metrically IDENTICAL to the hero's <h1> (same svg, same
       width rule, same gap, same tagline metrics) and both are centred in the
       viewport, so when the gate fades out the wordmark underneath is already
       at exactly the same place. Nothing moves; the room simply comes up
       behind it. Shared-element transition without a shared element. -->
  <div class="gate__stage">
    <img class="gate__logo" src="assets/wordmark.svg" alt="" width="1071" height="191" />
    <p class="gate__line mono" id="gateLine">EVERYTHING GOOD</p>
  </div>
  <p class="gate__count mono" id="gateCount">00</p>
  <button class="gate__skip mono" id="gateSkip" type="button">Skip</button>
</div>

<!-- ══════════ header ══════════ -->
<header class="hdr" id="hdr">
  <p class="hdr__side hdr__side--l mono">AUSTURSTRÆTI 12A &middot; AUSTURVÖLLUR</p>

  <a class="hdr__mark" href="#top" aria-label="Gilligogg, back to top">
    <img src="assets/wordmark.svg" alt="Gilligogg" width="1071" height="191" />
  </a>

  <div class="hdr__side hdr__side--r">
    <p class="mono hdr__open">HAPPY HOUR 16–19</p>
    <button class="burger" id="burger" aria-expanded="false" aria-controls="menu" aria-label="Open menu">
      <span class="burger__box" aria-hidden="true"><i></i><i></i></span>
      <span class="burger__word mono" aria-hidden="true">MENU</span>
    </button>
  </div>
</header>

<div class="menu" id="menu" hidden>
  <div class="menu__inner">
    <nav class="menu__nav" aria-label="Site">
      <a href="#drinks"><span><i class="mono" aria-hidden="true">01</i>The list</span></a>
      <a href="#classics"><span><i class="mono" aria-hidden="true">02</i>Classics</span></a>
      <a href="#paintings"><span><i class="mono" aria-hidden="true">03</i>The paintings</span></a>
      <a href="#crew"><span><i class="mono" aria-hidden="true">04</i>The bar</span></a>
      <a href="#cellar"><span><i class="mono" aria-hidden="true">05</i>Wine &amp; bubbles</span></a>
      <a href="#happy"><span><i class="mono" aria-hidden="true">06</i>Happy hour</span></a>
      <a href="#visit"><span><i class="mono" aria-hidden="true">07</i>Visit</span></a>
    </nav>
    <div class="menu__foot">
      <p class="mono">AUSTURSTRÆTI 12A &middot; 101 REYKJAVÍK</p>
      <a class="btn btn--main" href="mailto:${D.biz.email}">${D.biz.email}</a>
    </div>
  </div>
</div>

<main id="main">

<!-- ══════════ 1. hero ══════════ -->
<div class="heropin" id="heropin">
<section class="hero" id="top">
  <img class="hero__film" id="heroPlate" src="${P.bar.src}" alt="${esc(P.bar.alt)}" width="${P.bar.w}" height="${P.bar.h}" fetchpriority="high" decoding="async" />

  <div class="hero__scrim" aria-hidden="true"></div>
  <div class="hero__veil" aria-hidden="true"></div>

  <div class="hero__content">
    <p class="hero__eyebrow mono">COCKTAIL BAR &middot; AUSTURSTRÆTI &middot; FACING AUSTURVÖLLUR</p>

    <h1 class="hero__h1">
      <img class="hero__mark" id="heroMark" src="assets/wordmark.svg" alt="Gilligogg" width="1071" height="191" fetchpriority="high" />
      <span class="hero__tag">${esc(HERO_TAG)}</span>
    </h1>

    <div class="hero__base" id="heroBase">
      <p class="hero__blurb">Kjarval invented <em>gilligogg</em> and insisted it was pure Icelandic. It meant everything that is good. The bar took the word, and the room came with four paintings of a Reykjavík that never existed.</p>
      <div class="hero__acts">
        <a class="btn btn--main" href="#drinks">See the list</a>
        <a class="btn btn--ghost" href="#visit">Find us</a>
      </div>
    </div>

    <p class="hero__scroll mono" id="heroHint" aria-hidden="true">SCROLL</p>
  </div>
</section>
</div>

<!-- ══════════ 2. ticker ══════════ -->
<section class="ticker" aria-hidden="true">
  <div class="ticker__skew" id="tickSkew"><div class="ticker__track" id="tickTrack"></div></div>
</section>

<!-- ══════════ 3. thesis ══════════ -->
<section class="thesis" id="about">
  <div class="thesis__grid">
    <div class="thesis__text">
      <p class="kicker mono">01 / WHERE THE NAME COMES FROM</p>
      <h2 class="h2">Kjarval shouted it<br /><em>coming down the hill</em></h2>
      <p class="lead">He used it whenever something delighted him, and when people asked what it meant he told them it was pure Icelandic. He had made it up. It stood for everything good, and hello, and hurrah, and bravo, all at once.</p>
      <blockquote class="quote">
        <p>&bdquo;Gilligogg, gilligogg!&ldquo;</p>
        <footer>
          <span class="quote__who">Jóhannes S. Kjarval</span>
          <span class="quote__src mono">MORGUNBLAÐIÐ &middot; 8 SEPT 1965</span>
        </footer>
      </blockquote>
      <p class="thesis__gloss">The bar opened on Austurstræti in ${D.biz.opened}, took the painter's word for a name, and hung the walls with four large oil paintings by <em>Þrándur Þórarinsson</em>. Reykjavík as it looked early last century, crowded with faces from the city's cultural life, then and now.</p>
    </div>

    <ul class="facts">
      <li><span class="facts__n">8</span><span class="facts__l">Signature cocktails on the current list, each one built here rather than borrowed</span></li>
      <li><span class="facts__n">22</span><span class="facts__l">Classics, grouped the way the bar groups them: highballs, stirred, shaken</span></li>
      <li><span class="facts__n">4</span><span class="facts__l">Large oil paintings by Þrándur Þórarinsson on the walls of the room</span></li>
      <li><span class="facts__n">16<sup>–19</sup></span><span class="facts__l">Happy hour, every single day of the week</span></li>
    </ul>
  </div>

${fig('bar', 'THE BAR · AUSTURSTRÆTI 12A', 'bleed--tall')}
</section>

<!-- ══════════ 4. the list — every drink builds its own glass ══════════ -->
<section class="drinks paper" id="drinks">
  <header class="sec-head">
    <p class="kicker mono">02 / THE LIST</p>
    <h2 class="h2">Every drink,<br />poured in front of you</h2>
    <p class="sec-head__note">Their menu is published as nine photographs of a printed sheet, so none of it can be read by a search engine, a screen reader or a phone. Here it is as text. Every drink pours itself into the glass its own descriptor calls for, one band per ingredient.</p>
  </header>

  <div class="sheet">
${course('sig', 'Signatures', '3.200', D.signatures, dr => dr.d.startsWith('Long') ? 'highball' : 'coupe')}
${course('spr', 'Spritzes', D.spritzes.price, D.spritzes.items, () => 'wine')}
${course('zero', 'Zero percent', D.mocktails.price, D.mocktails.items, () => 'collins')}
  </div>

  <p class="sheet__note">Prices as printed on the bar's own sheet. Glass shapes follow their own <em>Short</em> / <em>Long</em> and <em>Highballs</em> / <em>Stirred</em> / <em>Shaken</em> groupings; band colours are illustrative, not a recipe.</p>
</section>

<!-- ══════════ 5. classics, by method ══════════ -->
<section class="classics" id="classics">
  <header class="sec-head sec-head--mid">
    <p class="kicker mono">03 / TWENTY-TWO CLASSICS</p>
    <h2 class="h2">Grouped by how<br />they are made</h2>
  </header>
  <div class="classics__grid">
${classicsBlock}
  </div>
</section>

<!-- ══════════ 6. the paintings ══════════ -->
<section class="paintings" id="paintings">
  <header class="sec-head">
    <p class="kicker mono">04 / ON THE WALLS</p>
    <h2 class="h2">A Reykjavík<br /><em>that never existed</em></h2>
    <p class="sec-head__note">Þrándur Þórarinsson, born in Akureyri in 1978, paints the way the old masters painted and puts the city in the frame: crowds, horses, statues, and faces you half recognise.</p>
  </header>

${fig('painting', 'PAINTED PANEL ABOVE THE BANQUETTE', 'bleed--wide')}
${fig('corner', 'THE CORNER · LEATHER TUB CHAIRS UNDER THE DARK PANEL')}
</section>

<!-- ══════════ 7. the bar crew ══════════ -->
<section class="crew" id="crew">
  <div class="crew__pin" id="crewPin">
    <header class="crew__head">
      <p class="kicker mono">05 / BEHIND THE BAR</p>
      <h2 class="h2">The people who<br />actually make it</h2>
      <p class="crew__note">This rail is built and empty on purpose. It holds eight portraits and a first name each, and nobody here is going to invent a bartender. Send the photographs and the names and it fills in an afternoon.</p>
    </header>
    <ul class="crew__track" id="crewTrack">
${crewBlock}
    </ul>
    <p class="crew__progress mono"><span id="crewCount">01</span> / ${n2(CREW_SLOTS.length - 1)}</p>
  </div>
</section>

<!-- ══════════ 8. wine and bubbles ══════════ -->
<section class="cellar paper" id="cellar">
  <header class="sec-head">
    <p class="kicker mono">06 / WINE &amp; BUBBLES</p>
    <h2 class="h2">The rest of<br />the list</h2>
    <p class="sec-head__note">Everything the printed sheet carries, as text. Eleven spellings on the wine list have been corrected against the bar's own pages, where two of them contradict each other.</p>
  </header>
  <div class="cellar__grid">
${wineBlock}
  </div>
</section>

<!-- ══════════ 9. happy hour ══════════ -->
<section class="rent" id="happy">
  <div class="rent__band">
    <p class="rent__eyebrow mono">EVERY DAY OF THE WEEK</p>
    <p class="rent__big">HAPPY HOUR<br />16 – 19</p>
    <p class="rent__sub">Not just weekdays. Not just early in the week. Every day, from four until seven.</p>
  </div>
</section>

<!-- ══════════ 10. visit ══════════ -->
<section class="visit" id="visit">
  <header class="sec-head">
    <p class="kicker mono">07 / VISIT</p>
    <h2 class="h2">On Austurstræti,<br />facing the square</h2>
  </header>

  <div class="visit__grid">
    <div class="visit__col">
      <h3 class="visit__h">Opening hours</h3>
      <ul class="hrs">${hoursRows}</ul>
      <p class="visit__hh mono">HAPPY HOUR ${esc(D.biz.happyHour).toUpperCase()}</p>
    </div>
    <div class="visit__col">
      <h3 class="visit__h">Where</h3>
      <p class="visit__addr">${esc(D.biz.street)}<br />${esc(D.biz.postal)} ${esc(D.biz.city)}</p>
      <p class="visit__blurb">Ground floor, on the Austurvöllur side, with tables out on the pavement when the weather allows.</p>
      <a class="btn btn--main" href="mailto:${D.biz.email}">${D.biz.email}</a>
      <a class="btn btn--ghost" href="https://www.instagram.com/${D.biz.instagram}" rel="noopener">@${D.biz.instagram}</a>
    </div>
  </div>

${fig('outside', 'THE TERRACE · AUSTURSTRÆTI')}
${fig('through', 'LOOKING BACK TOWARD THE DOORS')}
</section>

<!-- ══════════ 11. closer ══════════ -->
<section class="closer">
  <img class="closer__logo" src="assets/wordmark.svg" alt="Gilligogg" width="1071" height="191" />
  <p class="closer__line">Everything that is good, and hello, and hurrah, and bravo.</p>
  <a class="btn btn--main" href="#drinks">See the list</a>
</section>

<footer class="foot">
  <p class="mono">${esc(D.biz.street)} &middot; ${esc(D.biz.postal)} ${esc(D.biz.city)}</p>
  <p class="mono"><a href="mailto:${D.biz.email}">${D.biz.email}</a></p>
  <p class="mono foot__note">Concept redesign by SNDR. Not affiliated with the bar. Drinks, prices and hours transcribed from the bar's own published menu and website.</p>
</footer>

</main>

<script src="assets/vendor/lenis.min.js" defer></script>
<script src="assets/vendor/gsap.min.js" defer></script>
<script src="assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="app.js" defer></script>
</body>
</html>
`;

writeFileSync(join(ROOT, 'index.html'), html);
const drinks = D.signatures.length + D.spritzes.items.length + D.mocktails.items.length;
const classicCount = D.classics.reduce((a, g) => a + g.items.length, 0);
const wineCount = Object.values(D.wine.house).flat().length + Object.values(D.wine.bottles).flat().length +
                  D.wine.bubbles.glass.length + D.wine.bubbles.bottles.length;
console.log(`index.html written — ${drinks} poured drinks, ${classicCount} classics, ${wineCount} wines, ${CREW_SLOTS.length} crew slots`);
