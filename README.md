# 🐾 Pet Foster Connect
---

## 📋 Présentation de l'application

Pet Foster Connect est une application web collaborative développée par une équipe de 4 développeurs dans le cadre d'un projet académique. L'objectif principal est de créer une plateforme numérique facilitant la mise en relation entre familles d'accueil bénévoles et associations de protection animale pour le placement temporaire d'animaux en attente d'adoption.

### 🎯 Problématique identifiée

Les associations de protection animale font face à des difficultés pour trouver rapidement des familles d'accueil temporaire pour leurs animaux. Le processus traditionnel (contacts téléphoniques, réseaux sociaux, bouche-à-oreille) est souvent chronophage et peu structuré.

### 💡 Solution proposée

Une plateforme web centralisée, intuitive et sécurisée qui :

- Optimise la gestion des demandes et le suivi des placements
- Améliore la visibilité des animaux en attente d'accueil
- Simplifie la publication de profils d'animaux par les associations
- Facilite la recherche et la candidature pour les familles d'accueil

---

## 🚀 Installation et démarrage

### Prérequis
- React 19.1.0
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose

### Démarrage rapide

```bash
# Clonage du projet
git clone https://github.com/team/petfosterconnect.git
cd petfosterconnect

# Installation des dépendances
npm install

# Configuration de l'environnement
cp .env.example .env

# Démarrage avec Docker
docker-compose up -d || docker compose down && docker compose up --build -d 

# Application accessible sur http://localhost

#Documentation swagger 
#Par NGINX 
http://localhost/api/api-docs

```

---

## 👥 Équipe de développement

| Membre | Rôle | Responsabilités principales |
|--------|------|----------------------------|
| **Alexandre** | Développeur Frontend / Architecte technique |composants, intégrations|
| **Alex** | Développeur backend |API, base de données, architecture serveur|
| **Thomas** | Product owner| Developpeur frontend + reviews|
| **Nicolas** | développeur backend , DevOps | test, déploiement + sécurité backend |

---

## 🏗️ Architecture technique

### Architecture générale

L'application suit une architecture 3-tiers classique :

📊 Schéma des Tiers
┌─────────────────────────────────────────────┐
│         TIER 1 : PRÉSENTATION               │
│    (Frontend - Interface Utilisateur)       │
│                                             │
│  - React + TypeScript                       │
│  - Vite (Build tool)                        │
│  - Interface web responsive                 │
│  - Port 5173 (via Nginx port 80)           │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST
                   │ (via Nginx)
┌──────────────────▼──────────────────────────┐
│         TIER 2 : LOGIQUE MÉTIER             │
│         (Backend - API REST)                │
│                                             │
│  - Node.js + Express                        │
│  - Controllers (logique métier)             │
│  - Middlewares (auth, validation)           │
│  - JWT, Argon2, RBAC                        │
│  - Port 3000                                │
└──────────────────┬──────────────────────────┘
                   │ Sequelize ORM
                   │ (SQL)
┌──────────────────▼──────────────────────────┐
│         TIER 3 : DONNÉES                    │
│      (Base de Données PostgreSQL)           │
│                                             │
│  - PostgreSQL 16                            │
│  - Tables relationnelles                    │
│  - Contraintes, index                       │
│  - Port 5434                                │
└─────────────────────────────────────────────┘
![Architecture](docs/conception/architecture/architecture.svg)

### Stack technologique détaillée

#### 🌐 Frontend
- **React 19 + Vite** : Interface utilisateur moderne et réactive
- **TypeScript** : Typage statique pour la robustesse du code
- **React Router** : Navigation SPA fluide
- **CSS** : Design responsive

#### ⚙️ Backend
- **Node.js + Express.js** : API REST performante
- **Sequelize ORM** : Mapping objet-relationnel avec PostgreSQL
- **JWT (JSON Web Tokens)** : Authentification stateless sécurisée
- **argon2** : Hashage robuste des mots de passe

#### 🗃️ Base de données
- **PostgreSQL** : SGBD relationnel fiable et performant

#### 🚀 DevOps et déploiement
- **Docker + Docker Compose** : Conteneurisation des services
- **NGINX** : Reverse proxy et serveur web
- **GitHub Actions** : Intégration et déploiement continus (CI/CD)

---

## 📱 Fonctionnalités principales

### Pour les associations
- Création et gestion de profils d'animaux
- Publication d'annonces d'accueil
- Traitement des demandes de familles d'accueil
- Suivi des placements en cours
- Tableau de bord de gestion

### Pour les familles d'accueil
- Consultation des animaux disponibles
- Soumission de demandes d'accueil
- Gestion de profil et préférences
- Historique des accueils
- Communication avec les associations

### Fonctionnalités transversales
- Système d'authentification sécurisé
- Interface responsive (mobile-first)

---

## 🎨 Conception et modélisation

### Arborescence des fonctionnalités
L'application propose une navigation intuitive structurée autour de :

- **Authentification** : Inscription/connexion multi-rôles
- **Catalogue d'animaux** : Consultation et recherche
- **Gestion des demandes** : Workflow de mise en relation
- **Tableaux de bord** : Interfaces spécialisées par type d'utilisateur

### Modèle de données
La base de données relationnelle comprend les entités principales :

- **Users** : Utilisateurs (associations et familles d'accueil)
- **Animals** : Animaux en attente d'accueil
- **Requests** : Demandes d'accueil
- **Associations** : Associations partenaires

#### Relations entre entités :
- Association (1) → Animal (N) : Une association gère plusieurs animaux
- Role (1) → User (N) : Un rôle assigné à plusieurs utilisateurs
- Association (1) → User (N) : Une association peut avoir plusieurs membres
- User (1) → Request (N) : Un utilisateur fait plusieurs demandes
- Animal (1) → Request (N) : Un animal peut recevoir plusieurs demandes

**Flux principal** : User (famille) fait Request pour Animal géré par Association.

---

## 📊 Méthodologie agile

### Framework kanban
Le projet a été développé selon la méthodologie kanban avec :

- **Sprints de 3 semaines** : Itérations courtes pour un feedback rapide
- **Daily standups** : Synchronisation quotidienne de l'équipe
- **Sprint planning & retrospectives** : Planification et amélioration continue
- **Product backlog** : Priorisation des fonctionnalités par valeur métier

### Outils de collaboration
- **GitHub Project** : Gestion et suivi de projet
- **GitHub** : Versioning collaboratif avec GitFlow
- **Discord/Slack** : Communication asynchrone de l'équipe
- **Draw.io** : Prototypage et design system

---

## 🌍 Public cible et accessibilité

### Utilisateurs ciblés
- **Associations de protection animale** : Refuges, fondations, organisations bénévoles
- **Familles d'accueil potentielles** : Particuliers souhaitant aider temporairement
- **Amoureux des animaux** : Communauté engagée dans la cause animale

### Engagement accessibilité
Respect des standards WCAG 2.1 AA et RGAA pour :

- Accessibilité aux personnes en situation de handicap
- Compatibilité avec les technologies d'assistance
- Navigation au clavier optimisée
- Contrastes et typographies adaptés

---

## 🌱 Éco-conception et performance

### Optimisations techniques
- Code splitting et lazy loading React
- Compression des assets statiques
- Optimisation des requêtes SQL
- Mise en cache intelligente des données

### Bonnes pratiques environnementales
- Minification CSS/JS pour réduire les transferts
- Images optimisées et formats modernes (WebP)
- Architecture découplée pour l'évolutivité

---

## 📈 Résultats et perspectives

### Réalisations
- Application fonctionnelle avec toutes les fonctionnalités core
- Architecture scalable et maintenable
- Interface utilisateur moderne et responsive

### Améliorations futures
- Mobile app native (React Native)
- Notifications push en temps réel
- Système de géolocalisation pour les associations locales
- Module de dons intégré
- API publique pour l'écosystème associatif

---

## 📚 Documentation technique

- Guide d'installation détaillé
- Documentation API
- Architecture et diagrammes UML
- Guide de contribution

---

## 🤝 Contribution et communauté

Ce projet étant développé dans un contexte académique, les contributions externes ne sont pas acceptées durant la phase de développement initiale. 
Cependant, le code source sera rendu public après validation pédagogique.

---

## 📄 Licence

Ce projet est développé dans le cadre d'un projet étudiant. Tous droits réservés à l'équipe de développement et à l'établissement d'enseignement.

---

**PetFosterConnect - Faciliter l'accueil temporaire d'animaux, une mise en relation à la fois 🐾**

*Développé avec ❤️ par Nicolas (Backend), Alexandre (Frontend), Thomas (Frontend) et Alex (Backend)*