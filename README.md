# Éditions Jean de Portal - Plateforme Web

Plateforme Vue 3 + TypeScript pour consultations financières, e-commerce et gestion d'abonnements.

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 🚀 Installation rapide

### 1. **IMPORTANT : Configurer FontAwesome Pro d'abord**

Le projet utilise **FontAwesome Pro** qui nécessite une authentification.

1. Allez sur [fontawesome.com](https://fontawesome.com/) → Compte → Tokens
2. Copiez votre token d'API
3. Créez un fichier `.npmrc` à la racine du projet :
   ```bash
   cp .npmrc.example .npmrc
   ```
4. Éditez `.npmrc` et remplacez `YOUR_FONT_AWESOME_TOKEN` par votre token :
   ```ini
   @awesome.me:registry=https://npm.fontawesome.com/
   //npm.fontawesome.com/:_authToken=VOTRE_TOKEN_ICI
   ```

> ⚠️ **Sans cette étape, `npm install` échouera !**

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le serveur de dev

```bash
npm run dev
```

L'app sera sur **http://localhost:3000**

---

## 📜 Scripts disponibles

```bash
npm run dev              # Serveur de développement (port 3000)
npm run build            # Build de production
npm run preview          # Prévisualiser le build
npm run type-check       # Vérifier les types TypeScript
npm run validate:player-data  # Valider les données consultations
```

---

## 📁 Structure du projet

```
src/
├── api/                 # API client + mocks
├── components/          # Composants Vue
│   ├── account/         # Espace membre
│   ├── auth/            # Login/Register
│   ├── cart/            # Panier
│   ├── consultations/   # Webinaires + player
│   ├── home/            # Homepage
│   ├── layout/          # Navbar/Footer
│   ├── shop/            # Boutique
│   └── ui/              # Composants UI (Reka UI)
├── composables/         # Logique réutilisable
├── data/                # JSON (dev/mock)
├── router/              # Routes + guards
├── services/            # API services
├── stores/              # Pinia stores
├── types/               # Types TypeScript
├── utils/               # Fonctions utilitaires
└── views/               # Pages principales
```

---

## 🏗️ Stack technique

**Core** : Vue 3.5 • TypeScript 5.9 • Vite 7.1 • Pinia 3.0 • Vue Router 4.6

**UI** : TailwindCSS 4.1 • Reka UI 2.6 • Embla Carousel • FontAwesome Pro 7.1

**Forms** : VeeValidate 4.15 • Zod 3.25

**Utils** : VueUse • Axios (via apiClient) • class-variance-authority

---

## 🔐 Authentification

Le système d'authentification est en **mode mock** par défaut pour le développement.

### Identifiants de test

- **Email** : `test@example.com`
- **Mot de passe** : `Test1234`

### Basculer vers l'API réelle

Dans `src/services/auth.service.ts`, changez :

```typescript
const USE_MOCK = false  // true = mock, false = API réelle
```

---

## 🛒 Fonctionnalités principales

### Consultations & Webinaires
- Catalogue filtrable (Or, Argent, Immobilier, Patrimoine)
- Player vidéo avec chapitres et chat live
- Téléchargement dossiers/annexes (Premium)

### Boutique
- Recherche et filtres avancés
- Panier persistant (localStorage, 7 jours)
- Calcul TVA automatique (20%)

### Espace membre
- Profil, achats, abonnements
- Sécurité et préférences

---

## ⚙️ Configuration

### Variables d'environnement

Créez `.env.local` (optionnel) :

```env
VITE_API_BASE_URL=/api
VITE_MODE=development
```

### Proxy API (Vite)

Le proxy redirige `/api` vers votre backend. Configuration dans `vite.config.ts` :

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',  // URL backend
      changeOrigin: true
    }
  }
}
```

---

## 💻 Conventions de code

### Commits

Format : `type(scope): message`

```
feat(auth): add password reset
fix(cart): correct price calculation
docs(readme): update setup instructions
```

Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Structure des composants

```vue
<script setup lang="ts">
// 1. Imports
// 2. Props/Emits
// 3. Stores/Composables
// 4. State (ref/reactive)
// 5. Computed
// 6. Functions
// 7. Lifecycle
</script>

<template>
  <!-- Vue template -->
</template>
```

### Naming

- Composants : `PascalCase.vue` (ex: `ProductCard.vue`)
- Composables : `camelCase.ts` avec préfixe `use` (ex: `useCart.ts`)
- Stores : `camelCase.store.ts` (ex: `auth.store.ts`)

---

## 🎯 Points d'attention

### API Client centralisé

Le projet utilise un **client Axios centralisé** (`src/api/client.ts`), pas `vue-axios`.

- ✅ Token JWT injecté automatiquement
- ✅ Gestion erreurs 401 (déconnexion auto)
- ✅ Timeout 30s par défaut

### Cache localStorage

Les stores Pinia cachent les données en localStorage :

- `consultations.store.ts` → TTL 5 minutes
- `cart.store.ts` → TTL 7 jours
- `auth.store.ts` → Token + expiration

### Mode développement

Plusieurs services ont un mode mock pour développer sans backend :

- `auth.service.ts` → `USE_MOCK = true`
- `consultations.service.ts` → `USE_MOCK = true`

Bascule en `false` pour connecter à l'API réelle.

---

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

Fichiers générés dans `dist/`

### Variables d'environnement (prod)

```env
VITE_API_BASE_URL=https://api.votredomaine.com
VITE_MODE=production
```

---

## 📚 Documentation

WIP

---

## 🆘 Problèmes courants

### `npm install` échoue

➡️ Vérifiez que `.npmrc` est configuré avec votre token FontAwesome

### "Cannot find module '@awesome.me/kit-xxx'"

➡️ Token FontAwesome invalide ou expiré

### Erreur 401 sur les requêtes API

➡️ Vérifiez le mode mock ou la validité du token JWT

---

## 👥 Équipe

Projet développé par **IMI** pour Éditions Jean de Portal

---

**© 2025 Éditions Jean de Portal - Tous droits réservés**
