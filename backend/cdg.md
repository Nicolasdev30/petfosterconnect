# 🎯 Présentation du Projet — Pet Foster Connect

## 🔍 Objectif

Développer une application web moderne qui facilite la **mise en relation entre des familles d’accueil bénévoles** et des **associations de protection animale**, afin de **simplifier le placement temporaire des animaux** en attente d’adoption.

L’objectif est de centraliser les besoins d’accueil sur une même plateforme intuitive, accessible et sécurisée, pour fluidifier le processus, gagner du temps et augmenter les chances de placement des animaux abandonnés ou en transit.

## 👥 Public cible

### 🏢 Associations de protection animale

- Refuges, fondations et associations gérant des animaux en attente d’adoption.
- Besoin d’un outil structuré pour publier des profils d’animaux et traiter les demandes d’accueil.

### 🐶 Familles d’accueil potentielles

- Particuliers souhaitant aider temporairement des animaux (même sans pouvoir adopter).
- Besoin d’un espace clair pour voir les animaux disponibles et soumettre une demande.

### ❤️ Amoureux des animaux

- Toute personne souhaitant s’impliquer dans la cause animale (bénévolat, relais d’infos, futur donateur).
- L’application pourra devenir une porte d’entrée vers l’engagement associatif.

---

# La définition des besoins (problèmes auxquels répond le projet) et des objectifs (solutions qu'apporte le projet) du projet

---

## 1. Definition des besoins (problemes rencontrés)

### Besoin général

- Besoin d'une interface simple et intuitive pour voir les animaux ayant besoin d'une famille d'accueil.
- Besoin de d'effectuer et de suivre les demandes d'accueil.

### Coté assocations

- Besoin de traiter les données d'un grand nombre d'animaux.
- Besoin de traiter un grand nombre de demande et donc de dossier.
- Besoin de couvrir une large zone géographique.
- Besoin de visibilité sur les familles prêtes à acceuillir un animal.
- Besoin d'informatiser les données afin de faciliter leur traitement et archivage.

### Coté famille d'acceuil

- Besoin de voir les animaux ayant besoin d'une famille autour de chez soi.
- Besoin de d'accéder facilement aux besoins de chaque animal.

### Coté com et gestion

- Faciliter la communication entre les deux parties
- Suivi des stats, historiques etc

---

## 2. Objectif du projet (Solutions proposées)

### Objectifs fonctionnels

- Offrir une plateforme web fluide et **sécurisée** permettant aux association de publier des annonces d'animaux
- Permettre aux utilisateurs (famille acceuil) de rechercher des animaux selon les filtres (especes, localisation, dispo)
- Gerer les inscriptions, connextions, roles utilisateurs (famille d'acceuil / association)

### Objectif technique

- API REST sécurisé (routes CRUD auth etc)
- Systeme de BDD (postgres)
- front dynamique ergonomie responsive

## 3 Fontionnalités du projet (Spécification fonctionnelles)

### MVP

- Système d’authentification : inscription soit en tant que bénévole, soit en tant qu’association, connexion.
- Tableau de bord association : gestion des animaux (création des profils détaillés, modification, suppression), validation des demandes, etc.
- Recherche d’animaux à accueillir : par espèce, localisation, etc.
- Détail d’un animal : détails, faire une demande d’accueil (réceptionnée par l’association qui gère cet animal).
- Détail d’une association : détails, animaux en attente d’accueil.

# Architecture

## Architecture général

L'application Pet Foster Connect repose sur une **architecture découplée** (aussi appelée architecture en deux tiers) :

- Une **API REST** développée en Node.js/Express, suivant une organisation **MVC** côté serveur, qui gère l’accès aux données, la logique métier et la sécurité.
- Une **Single Page Application (SPA)** développée avec React (et Vite), qui consomme cette API pour afficher dynamiquement les données et offrir une expérience utilisateur fluide.

Ce découplage permet :

- Une meilleure **modularité** du code
- Un déploiement **indépendant** des deux parties (frontend / backend)
- Une **scalabilité** plus facile à moyen terme

## Choix technologiques

La partie client sera développé avec REACT afin de garantir une expérience utilisateur la plus fluide et dynamique possible. L'utilisation de la librairie REACT garantira le suivi et la maintenabilité de l'application. En effet cette librairie étant très populaire elle est régulièrement mise à jour et permet également l'accès à de nombreux modules compatibles.

La partie serveur sera développé sous environnement Node.js (runtime). La popularité du framework Express sera un atout dans le cadre du développement de ce projet, nous permettant l'accès à de nombreux modules. Les mises à jour régulière nous permettrons de garantir le suivi et la maintenabilité du projet dans le temps. L'utilisation Node.js nous permettra également de facilité de développement du projet autour d'un seul language de programmation Javascript.

La base de donnée sera une base de donnée relationnelle PostgreSQL. Le choix de cette technologie ayant été guidé par la structure des donneés à traitées, la robustesse de l'outil, les performances qu'il offre mais également les nombreuses fonctionnalité offertes nativement par l'outil.

Enfin nous utiliserons NGINX en tant que reverse proxy afin rediriger les différentes requêtes.

## Sécurité

La sécurité de l'application sera organisé autour de trois axes principaux:

- Authentification: Utilisation de la technologie jsonwebtoken
- Protection contre les attaques fréquentes: Top 10 OWASP (2021)

Le choix et la justification de 🛡️ OWASP Top 10 (2021) - Couverture sécuritaire

| Code    | Menace                          | Mesures implémentées                                                  |
| ------- | ------------------------------- | --------------------------------------------------------------------- |
| **A01** | **Broken Access Control**       | Système de rôles (foster/association) + middleware d'authentification |
| **A02** | **Cryptographic Failures**      | Hachage Argon2, HTTPS obligatoire, JWT sécurisé                       |
| **A03** | **Injection (SQL/JS)**          | ORM (protection requêtes) + validation stricte des inputs             |
| **A04** | **Insecure Design**             | Architecture MVC + bonnes pratiques de développement                  |
| **A05** | **Security Misconfiguration**   | Headers sécurisés, CORS configuré, variables d'environnement          |
| **A06** | **Vulnerable Components**       | Audit et mise à jour régulière des dépendances                        |
| **A07** | **Authentication Failures**     | JWT + hachage Argon2 + gestion sessions sécurisée                     |
| **A08** | **Data Integrity Failures**     | Pipeline CI/CD + tests automatisés + validation des données           |
| **A09** | **Logging & Monitoring**        | Logs sécurisés et monitoring des tentatives d'intrusion               |
| **A10** | **Server-Side Request Forgery** | Non applicable (pas de requêtes serveur vers externes)                |

### 🔒 Mesures additionnelles de sécurité

- **Chiffrement des données personnelles** : Données sensibles chiffrées en base
- **Hashage des mots de passe** : Argon2 avec salt unique par utilisateur
- **Gestion des rôles** : Contrôle d'accès basé sur les rôles (RBAC)

### 🛡️ Conformité RGPD - Mesures détaillées

#### **Données personnelles traitées dans l'application :**

- **Utilisateurs** : nom, prénom, email, mot de passe (hashé)
- **Associations** : nom, email, téléphone, adresse
- **Demandes** : messages personnalisés, horodatage des actions

#### **Mesures techniques implémentées :**

| Article RGPD                         | Implémentation dans Pet Foster Connect                                    |
| ------------------------------------ | ------------------------------------------------------------------------- |
| **Art. 25 - Privacy by Design**      | Minimisation des données : seules les données nécessaires sont collectées |
| **Art. 32 - Sécurité**               | Chiffrement Argon2, HTTPS, contrôle d'accès par rôles                     |
| **Art. 17 - Droit à l'effacement**   | Fonction de suppression de compte + anonymisation des données             |
| **Art. 16 - Droit de rectification** | Interface de modification des données personnelles                        |
| **Art. 15 - Droit d'accès**          | Export des données personnelles au format JSON                            |
| **Art. 20 - Portabilité**            | Export complet des données utilisateur                                    |
| **Art. 13/14 - Information**         | Politique de confidentialité claire et accessible                         |
| **Art. 7 - Consentement**            | Opt-in explicite lors de l'inscription                                    |

#### **Fonctionnalités RGPD dans l'application :**

```sql
-- Exemple : Suppression complète des données utilisateur
DELETE FROM request WHERE id_user = ?;
DELETE FROM "user" WHERE id_user = ?;
```

## Testabilité

Afin d'assurer la qualité du code produit, nous mettrons en place une batterie de test unitaire dans une démarche CI/CD avec l'outil github actions garantissant le principe de non régréssion. Ces tests seront développé avec la librairie vitest

## Déploiement

Afin de faciliter le déploiement de notre application nous mettrons en place la conteneurisation de cette dernière grâce à Docker. Le projet sera ensuite déployer sur un VPS. Le déploiement sera lui aussi intégré dans un démarche CI/CD.

Ressources utiles:

- <https://owasp.org/www-project-top-ten/>

# 🧱 Architecture et Stack Technique — Pet Foster Connect

## 🏗️ Architecture Générale

L'application Pet Foster Connect repose sur une **architecture découplée** (aussi appelée architecture en deux tiers) :

- Une **API REST** développée en Node.js/Express, suivant une organisation **MVC** côté serveur, qui gère l’accès aux données, la logique métier et la sécurité.
- Une **Single Page Application (SPA)** développée avec React (et Vite), qui consomme cette API pour afficher dynamiquement les données et offrir une expérience utilisateur fluide.

Ce découplage permet :

- Une meilleure **modularité** du code
- Un déploiement **indépendant** des deux parties (frontend / backend)
- Une **scalabilité** plus facile à moyen terme

Le backend et le frontend communiquent via des requêtes HTTP sécurisées. L’ensemble est déployé dans des conteneurs **Docker** et mis en production sur un **VPS avec NGINX** utilisé comme reverse proxy.

## ⚙️ Stack Technique détaillée

### 🌐 Frontend

| Technologie        | Rôle            | Justification                                    |
| ------------------ | --------------- | ------------------------------------------------ |
| React + Vite       | SPA interactive | Expérience fluide, réactivité, écosystème mature |
| TypeScript         | Typage statique | Sécurité de code, maintenabilité, IDE-friendly   |
| React Router       | Routage         | Navigation SPA sans rechargement                 |
| CSS / Tailwind CSS | UI Design       | Rapidité de développement, responsive design     |

### 🔧 Backend

| Technologie   | Rôle                    | Justification                                  |
| ------------- | ----------------------- | ---------------------------------------------- |
| Node.js       | Runtime JS côté serveur | Cohérence JS fullstack, performance I/O        |
| Express.js    | Framework web           | Routes, middlewares, gestion erreurs, API REST |
| Sequelize ORM | Gestion BDD             | Mapping JS/SQL, sécurité, migrations           |

### 🗃️ Base de Données

| Technologie | Rôle              | Justification                                          |
| ----------- | ----------------- | ------------------------------------------------------ |
| PostgreSQL  | BDD relationnelle | Fiabilité, compatibilité ORM, fonctionnalités avancées |

### 🔐 Authentification & Sécurité

| Technologie | Rôle           | Justification                        |
| ----------- | -------------- | ------------------------------------ |
| JWT         | Auth sécurisée | Token stateless, gestion de rôles    |
| argon2      | Hashage        | Protection robuste des mots de passe |

### 🚀 Déploiement / CI/CD

| Technologie      | Rôle             | Justification                              |
| ---------------- | ---------------- | ------------------------------------------ |
| Docker / Compose | Conteneurisation | Portabilité, uniformité environnement      |
| NGINX            | Reverse Proxy    | Redirection sécurisée, gestion HTTPS       |
| GitHub Actions   | CI/CD            | Lint, tests, build, déploiement automatisé |

### ✅ Tests & Qualité

| Outil  | Rôle  | Justification                         |
| ------ | ----- | ------------------------------------- |
| Vitest | tests | Si passage en ESM / Vite côté backend |

### 🌱 Éco-conception

- Minification CSS/JS
- Lazy loading
- Optimisation des images
- Suppression des dépendances inutilisées

> 🔗 Références utiles :
>
> - [OWASP Top 10](https://owasp.org/www-project-top-ten/)
> - [WCAG / RGAA Accessibilité](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)

---

# Public cible

L'application Pet Foster Connect s'adresse à tous les amoureux des animaux et plus particulièrement aux familles souhaitant acceuillir un animal, mais aussi aux associations de protection des animaux. La première version de cette application sera à destination du public français.

Les utilisateurs pourront donc avoir des profils variés, c'est la raison pour laquelle il sera nécessaire de rendre notre application accessible au plus grand nombre. Cela implique le respect des régles du référentiel RGAA. Le respect de ces règles assurera une meilleure accessiblité du produit aux personnes en situation de handicape.

Sources utiles:

<https://accessibilite.numerique.gouv.fr/>

# 🧭 Routes API prévues — Pet Foster Connect

## 🔐 AUTHENTIFICATION

| Méthode | Endpoint       | Description                          | Accès                 |
| ------- | -------------- | ------------------------------------ | --------------------- |
| POST    | /auth/register | Inscription avec rôle (famille/asso) | **PUBLIC**            |
| POST    | /auth/login    | Connexion et génération de JWT       | **PUBLIC**            |
| POST    | /auth/logout   | Déconnexion et suppression de JWT    | **AUTH (tous rôles)** |
| GET     | /auth/profile  | Récupération du profil connecté      | **AUTH (tous rôles)** |

## 🐾 ANIMAUX

| Méthode | Endpoint      | Description                   | Accès           |
| ------- | ------------- | ----------------------------- | --------------- |
| GET     | /animals      | Liste des animaux (filtrable) | **PUBLIC**      |
| GET     | /animals/\:id | Détail d’un animal            | **PUBLIC**      |
| POST    | /animals      | Création d’un animal          | **AUTH (asso)** |
| PATCH   | /animals/\:id | Modification d’un animal      | **AUTH (asso)** |
| DELETE  | /animals/\:id | Suppression d’un animal       | **AUTH (asso)** |

## 📩 DEMANDES D’ACCUEIL

| Méthode | Endpoint           | Description                               | Accès              |
| ------- | ------------------ | ----------------------------------------- | ------------------ |
| POST    | /requests          | Créer une demande d’accueil               | **AUTH (famille)** |
| GET     | /requests/user     | Voir ses propres demandes                 | **AUTH (famille)** |
| GET     | /requests/received | Voir les demandes reçues pour ses animaux | **AUTH (asso)**    |
| PATCH   | /requests/\:id     | Modifier le statut d’une demande          | **AUTH (asso)**    |

## 🏢 ASSOCIATIONS

| Méthode | Endpoint           | Description                               | Accès           |
| ------- | ------------------ | ----------------------------------------- | --------------- |
| GET     | /associations      | Récupération de la liste des associations | **PUBLIC**      |
| GET     | /associations/\:id | Détail d’une association                  | **PUBLIC**      |
| POST    | /association       | Création d’une association                | **AUTH (asso)** |

## 👮 ADMIN

| Méthode | Endpoint          | Description               | Accès     |
| ------- | ----------------- | ------------------------- | --------- |
| DELETE  | /association/\:id | supprimer une association | **ADMIN** |
| DELETE  | /user/\:id        | supprimer un utilisateur  | **ADMIN** |
| DELETE  | /animal/\:id      | supprimer un animal       | **ADMIN** |

## ✅ Validation des Données

- Toutes les données envoyées à l’API seront **validées** côté backend avec des middlewares `express-validator`.
- Cela garantit la **conformité des formats**, la **prévention des injections** et une meilleure **gestion des erreurs utilisateurs**.

---

# 👥 User Stories — Pet Foster Connect

Les user stories décrivent les attentes fonctionnelles des différents types d'utilisateurs. Elles servent de base pour le découpage technique, la priorisation du backlog et la validation du MVP.

---

## 🧭 Utilisateur non connecté (visiteur)

- En tant que **visiteur**, je veux pouvoir **consulter la liste des animaux disponibles** afin de **décider si je souhaite m’inscrire**.
- En tant que **visiteur**, je veux pouvoir **voir les informations d’une association** afin de **m’informer sur son activité**.
- En tant que **visiteur**, je veux pouvoir **créer un compte famille d’accueil ou association** afin **d’utiliser la plateforme**.

---

## 🐶 Utilisateur connecté — rôle : Famille d’accueil

- En tant que **famille d’accueil**, je veux **pouvoir me connecter à mon espace personnel** afin **d’accéder à mes fonctionnalités**.
- En tant que **famille d’accueil**, je veux **consulter la liste des animaux filtrés (espèce, localisation)** afin de **repérer ceux que je peux accueillir**.
- En tant que **famille d’accueil**, je veux **consulter la fiche détaillée d’un animal** afin de **connaître ses besoins**.
- En tant que **famille d’accueil**, je veux **faire une demande d’accueil pour un animal** afin de **proposer mes services à une association**.
- En tant que **famille d’accueil**, je veux **voir mes demandes en attente / validées / refusées** afin de **suivre leur évolution**.

---

## 🏢 Utilisateur connecté — rôle : Association

- En tant **qu’association**, je veux **pouvoir me connecter à mon tableau de bord** afin de **gérer les profils animaux**.
- En tant **qu’association**, je veux **pouvoir créer un nouveau profil animal** afin de **le proposer à l’accueil**.
- En tant **qu’association**, je veux **pouvoir modifier ou supprimer un profil animal** afin de **garder mes données à jour**.
- En tant **qu’association**, je veux **pouvoir consulter les demandes d’accueil reçues pour un animal** afin de **les traiter**.
- En tant **qu’association**, je veux **pouvoir accepter ou refuser une demande** afin **d’organiser les placements**.

---

## 🔁 Commun (tous rôles connectés)

- En tant **qu’utilisateur**, je veux **pouvoir consulter mon profil** pour **voir mes informations personnelles**.
- En tant **qu’utilisateur**, je veux **pouvoir me déconnecter en un clic** pour **sécuriser ma session**.

---

# mpd

```sql

DROP TABLE IF EXISTS request;
DROP TABLE IF EXISTS animal;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS association;
DROP TABLE IF EXISTS role;


-- 🎭 Table : role
CREATE TABLE role (
  id_role INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  label VARCHAR(50) NOT NULL UNIQUE
);

-- 🏢 Table : association
CREATE TABLE association (
  id_association INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT NOT NULL
);

-- 👤 Table : user
CREATE TABLE "user" (
  id_user INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  id_role INTEGER NOT NULL REFERENCES role(id_role) ON DELETE RESTRICT,
  id_association INTEGER REFERENCES association(id_association) ON DELETE SET NULL
);

-- 🐾 Table : animal
CREATE TABLE animal (
  id_animal INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50),
  breed VARCHAR(100),
  age INTEGER CHECK (age >= 0),
  description TEXT,
  photo_url TEXT,
  status VARCHAR(20) CHECK (status IN ('disponible', 'accueilli')) DEFAULT 'disponible',
  id_association INTEGER NOT NULL REFERENCES association(id_association) ON DELETE RESTRICT
);

-- ✉️ Table : request
CREATE TABLE request (
  id_request INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'refused')) DEFAULT 'pending',
  message TEXT,
  id_user INTEGER NOT NULL REFERENCES "user"(id_user) ON DELETE RESTRICT,
  id_animal INTEGER NOT NULL REFERENCES animal(id_animal) ON DELETE RESTRICT
);
```
