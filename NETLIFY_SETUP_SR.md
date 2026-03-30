# Netlify deployment guide for securing API keys

## Koraci za sigurnu deployment:

### 1. NETLIFY ENVIRONMENT VARIJABLE

Idi na Netlify dashboard → Your site → Site settings → Build & deploy → Environment

Postavi ove varijable:
```
FIREBASE_API_KEY = "AIzaSyAUB40kLjGcV3IX_36ndUNl86VbOGDNIEU"
TMDB_API_KEY = "f300e933685acb83d84aa24df1bb7170"
TMDB_BEARER_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9..."
```

### 2. BUILD COMMAND UPDATE

U `package.json`, ažuriraj build script ili dodaj u `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist/imdblike"
  environment = { NODE_ENV = "production" }

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. KREIRAJ netlify.toml NA NIVOU PROJEKTA

```toml
[build]
  command = "npm run build"
  publish = "dist/imdblike"

# Postavi environment varijable
[env.production]
  environment = { NODE_ENV = "production" }

# Edge function za ubacivanje env varijabli
[[edge_functions]]
  path = "/assets/env.js"
  function = "env"
```

### 4. KREIRAJ EDGE FUNCTION (opciono - direktan pristup)

Ili koristi build hook da automatski generiše env.js:

**Korak u terminalu:**
```bash
# U Netlify dashboard: Build & deploy → Build hooks
# Kreiraj hook koji pokreće build
```

### 5. ALTERNATIVA - Koristi .env.local (za development)

Za lokalni development, kreiraj `.env.local`:
```
FIREBASE_API_KEY=AIzaSyAUB40kLjGcV3IX_36ndUNl86VbOGDNIEU
TMDB_API_KEY=f300e933685acb83d84aa24df1bb7170
TMDB_BEARER_TOKEN=Bearer eyJhbGciOiJIUzI1NiJ9...
```

## VAŽNO - Dodaj u .gitignore:

Otvori `.gitignore` i dodaj:
```
.env
.env.local
.env.*.local
```

## Kao će funkcionisati:

1. ✅ **Development**: `env.ts` koristi `getEnvVariable()` koja pristupa `window.__env__`
2. ✅ **Localhost**: Koristi fallback vrijednosti ili `.env.local`
3. ✅ **Netlify**: Build proces ubacuje env varijable u `env.js` ili via function

## Test nakon deploy:

1. Otvori DevTools → Console
2. Upis: `window.__env__`
3. Trebao bi vidjeti tvoje varijable

## Script Node za generisanje env.js (ako trebas):

Kreiraj `scripts/generate-env.js`:

```javascript
const fs = require('fs');
const path = require('path');

const env = `
window.__env__ = window.__env__ || {};
window.__env__.FIREBASE_API_KEY = "${process.env.FIREBASE_API_KEY || ''}";
window.__env__.TMDB_API_KEY = "${process.env.TMDB_API_KEY || ''}";
window.__env__.TMDB_BEARER_TOKEN = "${process.env.TMDB_BEARER_TOKEN || ''}";
`;

fs.writeFileSync(
  path.join(__dirname, '../src/assets/env.js'),
  env
);

console.log('✅ env.js generated successfully!');
```

Dodaj u `package.json`:
```json
"scripts": {
  "generate-env": "node scripts/generate-env.js",
  "build": "npm run generate-env && ng build"
}
```

---

## NAJJEDNOSTAVNIJE RJEŠENJE (Preporučujem):

1. Koristi upper environment varijable u Netlify
2. Koristi build hook sa `npm run generate-env && ng build` komandom
3. env.js će biti automatski generiisan sa pravim vrijednostima
