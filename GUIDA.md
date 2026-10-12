# Guida al sito: come modificarlo

Il sito separa tre cose: **testi** (file JSON), **aspetto** (un file di configurazione e uno di colori) e **componenti** (i blocchi riusabili). Quasi sempre basta toccare i JSON.

```
src/
├── config/site.ts          → colore d'accento, titolo/descrizione per Google, menu
├── app/globals.css         → colori chiaro/scuro (sezione "Theme tokens")
├── content/
│   ├── profile.json        → home: hero, card, AI in production, stack, certificazioni, chiusura
│   ├── experience.json     → esperienze (aziende e ruoli)
│   ├── projects.json       → progetti
│   └── schemas.ts          → regole che i JSON devono rispettare
├── components/site/        → blocchi del sito (Tile, Chip, header, footer, galleria…)
└── app/                    → pagine: page.tsx (home), experience, projects, projects/[id]
public/images/              → immagini (foto profilo, screenshot dei progetti)
```

Dopo ogni modifica: `pnpm dev` e guardi su http://localhost:3000. Prima di pubblicare: `pnpm typecheck` e `pnpm build`. Se un JSON ha un campo sbagliato o mancante, la build si ferma e dice quale file e quale campo.

---

## Le modifiche più comuni

### Cambiare un testo
Apri il JSON giusto in `src/content/` e cambia il valore. Esempi:
- titolo della home → `profile.json` → `tagline` (`before` + parola evidenziata `highlight` + `after`)
- card "Now" / "Before" → `profile.json` → `cards`
- frase finale → `profile.json` → `closing`; citazione → `quote`

### Cambiare il colore d'accento
`src/config/site.ts` → `theme.accent` (es. `'#7DD3FC'`). Se scegli un colore scuro, metti `accentForeground: '#FFFFFF'`.

### Cambiare i colori chiaro/scuro
`src/app/globals.css` → blocchi `:root` (chiaro) e `.dark` (scuro), sezione "Theme tokens".

### Aggiungere una voce al menu
`src/config/site.ts` → `nav`: aggiungi `{ label: 'Blog', href: '/blog' }`.

---

## Aggiungere contenuti

### Un nuovo ruolo o una nuova azienda
`src/content/experience.json`. Le aziende vanno dalla più recente alla più vecchia; dentro ogni azienda, i ruoli dal più recente.

```json
{
  "id": "acme-solutions-engineer",
  "position": "Solutions Engineer",
  "startDate": "2027-01",
  "current": true,
  "achievements": ["Cosa hai fatto, una frase per punto"],
  "technologies": ["Claude API", "Python"]
}
```
- date nel formato `"AAAA-MM"`; `endDate` solo se il ruolo è finito
- al ruolo precedente togli `"current": true` e aggiungi `"endDate"`
- `homeTitle` sull'azienda (facoltativo) mostra in home una sola riga per tutta l'azienda

### Un nuovo progetto
`src/content/projects.json`, più le immagini in `public/images/<id-progetto>/`.

```json
{
  "id": "mio-progetto",
  "title": "Mio progetto",
  "description": "Una riga: cosa fa.",
  "longDescription": "Un paragrafo per la pagina di dettaglio.",
  "image": "/images/mio-progetto/cover.png",
  "screenshots": ["/images/mio-progetto/1.png", "/images/mio-progetto/2.png"],
  "technologies": ["Next.js", "Claude API"],
  "githubUrl": "https://github.com/Antonio-Tamburello/mio-progetto",
  "demoUrl": "https://mio-progetto.vercel.app",
  "status": "active",
  "isFeatured": true,
  "category": "AI",
  "label": "Live · Next.js"
}
```
- `status`: `active`, `wip` (in corso: bordo tratteggiato e primo in pagina Projects) o `archived`
- `isFeatured: true` → compare anche in home
- `label` → la scritta piccola sopra il titolo nelle card
- la pagina di dettaglio `/projects/<id>` si crea da sola
- screenshot: PNG o JPG larghi circa 1600 px, stesso formato (16:9) per tutti

### Quando rag-forge diventa pubblico
In `projects.json`, alla voce `rag-forge`:
```json
"githubUrl": "https://github.com/Antonio-Tamburello/rag-forge",
"status": "active",
"label": "Open source",
"longDescription": "Cosa misura, come si usa, cosa hai imparato.",
"screenshots": ["/images/rag-forge/report.png"]
```
Se vuoi che stia anche nella sezione **AI in production** della home, aggiungi una voce in `profile.json` → `aiWork` con `"context": "Open source"` e `"url": "https://github.com/Antonio-Tamburello/rag-forge"` (compare il pulsante "See it ↗"). Poi aggiungi il link anche nella sezione Featured di LinkedIn.

### Una nuova card in "AI in production"
`profile.json` → `aiWork`: `title`, `description`, `tags`, `icon` (`FileText`, `ScanSearch` o `Sparkles`), `context` (es. "At Reset · internal tool") e, se esiste, `url` pubblico.
Per altre icone: sceglila su lucide.dev e aggiungila alla lista `icons` in `src/app/page.tsx`.

### Un nuovo attestato
`profile.json` → `certifications`: `{ "issuer": "Anthropic", "name": "Nome corso" }`.

---

## Aggiungere una nuova sezione alla home

1. **Dati** — aggiungi il campo in `profile.json` (es. `"talks": [{ "title": "...", "url": "..." }]`) e la regola corrispondente in `ProfileSchema` dentro `schemas.ts`.
2. **Markup** — in `src/app/page.tsx` aggiungi un blocco usando i componenti di `components/site/bento.tsx`:
   ```tsx
   <section className="flex flex-col gap-5 pt-[72px]">
     <SectionHeader id="talks" title="Talks" />
     <div className="flex flex-wrap gap-3.5">
       {profile.talks.map((talk) => (
         <Tile key={talk.title} href={talk.url} className="flex-[1_1_300px]">
           <span className="text-xl font-semibold">{talk.title}</span>
         </Tile>
       ))}
     </div>
   </section>
   ```
3. **Menu** (facoltativo) — in `site.ts` → `nav`: `{ label: 'Talks', href: '/#talks' }`.

I componenti disponibili: `Tile` (card; varianti `default`, `brand`, `inverted`, `dashed`; con `href` diventa un link), `Eyebrow` (etichetta piccola), `Chip` / `ChipList` (tag), `Highlight` (parola evidenziata), `SectionHeader` (titolo + link), `ButtonLink` (pulsante), `PageContainer` (larghezza pagina). La larghezza delle card si regola con `flex-[1_1_300px]`: il numero finale è la larghezza minima prima di andare a capo.

## Aggiungere una nuova pagina
Crea `src/app/<nome>/page.tsx` copiando la struttura di `src/app/projects/page.tsx` (PageContainer + PageIntro + card). Header e footer arrivano in automatico dal layout. Aggiungi la voce al menu in `site.ts`.

## Cose da sapere
- La foto profilo è `public/images/profile_image.jpeg`; per sostituirla tieni lo stesso nome, oppure cambia `avatar` in `profile.json`. `avatarPosition` decide quale parte della foto si vede ("50% 30%" = centro, un po' in alto).
- I font (Sora e Geist Mono) si scaricano da Google al momento della build: serve la connessione.
- La pagina `/case-studies` non è collegata: chi ci arriva viene mandato su `/projects` (vedi `next.config.ts`).
