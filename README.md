This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 🍽️ Vite & Gourmand

**Vite & Gourmand** est une application web de **commande de plats traiteur haut de gamme**, conçue pour offrir une **expérience utilisateur fluide, moderne et élégante**.  
Grâce à une interface épurée et performante, les utilisateurs peuvent découvrir, personnaliser et commander des plats d’exception en toute simplicité.

---

## 🚀 Aperçu du projet

- 🧭 **Interface moderne** — design clair et agréable, adapté aux mobiles et tablettes.
- ⚡ **Performances optimisées** — rendu serveur côté Next.js et hydration rapide grâce à React 19.
- 🍽️ **Catalogue dynamique** — plats filtrables par catégorie, saison ou préférences alimentaires.
- 💳 **Commande fluide** — ajout au panier, validation et suivi en temps réel.
- 🌙 **Mode clair/sombre** — basculement automatique ou manuel via _next-themes_.
- 🧑‍🍳 **Espace traiteur** — gestion des plats, commandes et clients.

---

## 🛠️ Stack technique

- **Framework :** [Next.js 16](https://nextjs.org/) (App Router)
- **UI :** [React 19](https://react.dev/) + [Geist UI](https://geist-ui.dev/)
- **Langage :** [TypeScript](https://www.typescriptlang.org/)
- **Styles :** CSS global + modules, gestion du thème via [next-themes](https://github.com/pacocoursey/next-themes)
- **Linting & Qualité :** ESLint flat config + eslint-config-next
- **Base de données :** [PlanetScale](https://planetscale.com/) (MySQL)
- **ORM :** [Prisma](https://www.prisma.io/)
- **Hébergement :** Vercel

---

## ⚙️ Installation & exécution

```bash
# 1️⃣ Cloner le dépôt
git clone https://github.com/<ton-utilisateur>/vite-et-gourmand.git

# 2️⃣ Accéder au dossier
cd vite-et-gourmand

# 3️⃣ Installer les dépendances
npm install

# 4️⃣ Configurer les variables d’environnement
cp .env.example .env.local
# Ensuite, renseigne les valeurs (Base de données PlanetScale, etc.)

# 5️⃣ Lancer le projet en développement
npm run dev
```

Une fois démarré, rends-toi sur 👉 [http://localhost:3000](http://localhost:3000)

---

## 🧩 Structure du projet

vite-et-gourmand/
├── app/ → Routage et pages principales (App Router)
├── components/ → Composants UI réutilisables
├── lib/ → Utilitaires et configuration Prisma
├── prisma/ → Schéma et migrations de la base de données
├── public/ → Images, icônes, favicon…
├── styles/ → Feuilles de style globales et modules CSS
├── eslint.config.mjs → Configuration ESLint
├── tsconfig.json → Configuration TypeScript
└── next.config.mjs → Configuration Next.js

---

## 💾 Base de données

Le projet utilise **PlanetScale (MySQL)** pour une base scalable et sans downtime.  
L’accès se fait via **Prisma**, ce qui facilite la gestion du schéma avec la commande :

```bash
npx prisma migrate dev
```

et l’inspection du modèle :

```bash
npx prisma studio
```

---

## 🎨 Aperçu visuel

_TBD_  
![Vite & Gourmand UI Preview](source)

---

## 📜 Licence

Ce projet est distribué sous licence **MIT**.
