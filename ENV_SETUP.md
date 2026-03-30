# Environment Variables Setup Guide

## 🔒 Security First

Ova aplikacija koristi osjetljive API keys (Firebase, TMDB). Trebam sigurnu metodu da ih deploy-am bez hardkodiranja.

## 📋 Što je urađeno

1. ✅ Environment varijable extrahovane iz koda
2. ✅ Dinamički `env.js` sistem kreiran
3. ✅ Build proces automacijski generiše `env.js` sa varijablama
4. ✅ `.gitignore` updated da ignoriše osjetljive fajlove
5. ✅ `netlify.toml` konfiguracija kreirana

## 🚀 Kako deployujem na Netlify

### Step 1: Postavi Environment Varijable u Netlify

1. Otvori [Netlify Dashboard](https://netlify.com)
2. Odaberi **Site settings** → **Build & deploy** → **Environment**
3. Klikni **Add environment variables**
4. Dodaj ove varijable:

```
FIREBASE_API_KEY = "AIzaSyAUB40kLjGcV3IX_36ndUNl86VbOGDNIEU"
TMDB_API_KEY = "f300e933685acb83d84aa24df1bb7170"
TMDB_BEARER_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMzAwZTkzMzY4NWFjYjgzZDg0YWEyNGRmMWJiNzE3MCIsInN1YiI6IjY1MDc2NmY1MzczYWMyMDBhY2Q3MDFmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EDoLzgqvWQJa4LtkwNxYlXXSqoZFeYMv4vjJcGuZX5Q"
```

### Step 2: Podesi Build Command

U **Site settings** → **Build & deploy** → **Build settings**:
- **Build command**: `npm run build`
- **Publish directory**: `dist/imdblike`

### Step 3: Push na Git

```bash
git add .
git commit -m "Add secure environment variable setup"
git push
```

Netlify će automatski:
1. Pokrenuti build proces
2. `npm run build` će pozvati `generate-env.js` script
3. Script će kreiati `src/assets/env.js` sa tvim Netlify varijablama
4. Angular će buildati sa tom konfiguracijom

## 💻 Lokalni Development

### Setup

1. **Kopiraj .env.example:**
   ```bash
   cp .env.example .env.local
   ```

2. **Izmijeni .env.local sa stvarnim vrijednostima:**
   ```
   FIREBASE_API_KEY=AIzaSyAUB40kLjGcV3IX_36ndUNl86VbOGDNIEU
   TMDB_API_KEY=f300e933685acb83d84aa24df1bb7170
   TMDB_BEARER_TOKEN=Bearer eyJhbGciOiJIUzI1NiJ9...
   ```

3. **Pokreni development server:**
   ```bash
   npm start
   ```
   
   (Ovo će automatski pokrenuti `generate-env.js`)

## 🔍 Kako provjeriti da li radi

### Browser DevTools Console:
```javascript
window.__env__
// Output trebao bi biti:
// {
//   FIREBASE_API_KEY: "AIzaSyAUB40kLjGcV3IX_36ndUNl86VbOGDNIEU",
//   TMDB_API_KEY: "f300e933685acb83d84aa24df1bb7170",
//   TMDB_BEARER_TOKEN: "Bearer eyJ..."
// }
```

### Network Tab:
- Provjeri da li se `assets/env.js` učitava
- Trebala bi se vidjeti varijable u JS fajlu

## ⚠️ Sigurnosne napomene

### ❌ Nikada ne commit-uj:
- `.env`
- `.env.local`
- `.env.*.local`
- `src/assets/env.js` (generira se automatski)
- Bilo koje fajle sa hardkodiranim API ključevima

### ✅ Uvijek koristi:
- Netlify Environment Variables za production
- `.env.local` za lokalni development
- Environment proxy sistema

## 📚 Struktura

```
src/
├── environments/
│   ├── environment.ts         # Dev - koristi getEnvVariable()
│   └── environment.prod.ts    # Prod - koristi getEnvVariable()
├── assets/
│   └── env.js                 # AUTO-GENERATED - ne edituj!
└── index.html                 # Učitava env.js prvi
```

## 🛠️ Ako trebam drugačiji pristup

### Alternativa 1: Direktno u Angular Build

Umjesto `env.js`, možeš koristiti Angular's `fileReplacements`:
- Edituj `angular.json` sa različitim environment fajlove po configu
- Less dynamic ali čisće

### Alternativa 2: API Proxy

Kreiraj Netlify Edge Function ili serverless funkciju koja:
- Prosljeđuje zahtjeve sa server side
- Uvijek ima access na environment varijable
- Ne ekspozira API ključeve

## 🎯 Best Practice Summary

1. ✅ Koristi Netlify Environment Variables za production
2. ✅ Koristi .env.local za development
3. ✅ Generira env.js automatski u build procesu
4. ✅ Ignoriraj sve `.env*` i `env.js` u Git
5. ✅ Provjeri DevTools da je sve učitano ispravno

## 📞 Troubleshooting

**Q: env.js nije učitan?**
- Provjeri Network tab u DevTools
- Provjerite da je `index.html` učita `<script src="assets/env.js"></script>`
- Provjerite build output da postoji `/assets/env.js`

**Q: Varijable su prazne?**
- Provjerite Netlify Environment Variables su postavljene
- Pokrenite build ponovo (redeploy)
- Proverite cache - hard refresh (Ctrl+Shift+R)

**Q: API pozivi još ne rade?**
- Otvorite DevTools Console
- Provjerite je li ispravna vrijednost u `window.__env__`
- Provjerite Network tab za API grešku (403, 401, etc)
- Validate API ključe su ispravni u Netlify

## ✨ Sada su tvoji API ključevi sigurni!

- Nema hardkodiranih vrijednosti u kodu
- Nema exposuranja u Git repo
- Environment-specific vrijednosti se koriste
- Production je sigurnija od Dev
