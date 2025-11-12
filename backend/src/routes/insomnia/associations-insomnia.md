# 🏢 Tests Associations Routes - Guide Insomnia Simple

## 📋 Prérequis

1. **Serveur démarré** : `npm run dev` depuis la racine du projet
2. **Base de données** : PostgreSQL avec les données d'exemple chargées
3. **Insomnia** : Outil de test API installé

---

## 🎯 Tests à réaliser

### 1. 📋 Lister toutes les associations (public) (ok)

```http
GET http://localhost:3000/api/associations
```

**Résultat** : Liste de toutes les associations disponibles

---

### 2. 🔍 Rechercher des associations par nom (ok)

```http
GET http://localhost:3000/api/associations?search=Refuge
```

**Résultat** : Associations contenant "Refuge" dans leur nom

---

### 3. 👁️ Voir une association spécifique - Refuge des 4 Pattes (ok)

```http
GET http://localhost:3000/api/associations/1
```

**Association** : Refuge des 4 Pattes avec tous ses animaux (Rex, Luna, Max)

---

### 4. 👁️ Voir une association spécifique - SOS Matous (ok)

```http
GET http://localhost:3000/api/associations/2
```

**Association** : SOS Matous avec ses chats (Minette, Whiskers, Smokey)

---

### 5. ➕ Créer une nouvelle association (utilisateur foster) (ok)

**Étape 1** - Connexion avec un compte foster :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "marie.dupont@example.com",
  "password": "marie123"
}
```

**Étape 2** - Créer l'association :

```http
POST http://localhost:3000/api/associations/create
Authorization: Bearer VOTRE_TOKEN_FOSTER_ICI
Content-Type: application/json

{
  "name": "Nouvel Espoir Animal",
  "email": "contact@nouvelespoir.org",
  "phone": "0123456789",
  "address": "15 rue de la Paix, 75001 Paris"
}
```

**Note** : Marie devient automatiquement gestionnaire de cette nouvelle association

---

### 6. ✏️ Modifier son association (Jean - Refuge des 4 Pattes) (ok)

**Étape 1** - Connexion Jean :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "jean.dubois@4pattes.org",
  "password": "admin4pattes"
}

**Étape 2** - Modifier l'association :

```http
PATCH http://localhost:3000/api/associations/1
Authorization: Bearer VOTRE_TOKEN_JEAN_ICI
Content-Type: application/json

{
  "phone": "0123456790",
  "address": "12 rue des Animaux, 75011 Paris - NOUVEAU BÂTIMENT"
}
```

---

### 7. ✏️ Modifier son association (Anne - SOS Matous)(ok)

**Étape 1** - Connexion Anne :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "anne.durand@sosmatous.org",
  "password": "sosmatous123"
}
```

**Étape 2** - Modifier l'association :

```http
PATCH http://localhost:3000/api/associations/2
Authorization: Bearer VOTRE_TOKEN_ANNE_ICI
Content-Type: application/json

{
  "name": "SOS Matous - Association Féline",
  "phone": "0987654322"
}
```

---

### 8. 🗑️ Supprimer une association (admin uniquement) (ok)

**Étape 1** - Connexion admin :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@petfosterconnect.com",
  "password": "AdminPass123"
}
```

**Étape 2** - Supprimer l'association Protection Animale 33 :

```http
DELETE http://localhost:3000/api/associations/5
Authorization: Bearer VOTRE_TOKEN_ADMIN_ICI
```

**⚠️ Note** : Supprime aussi Thomas Blanc et tous les animaux (Buddy, Shadow, Coco, Nala)

---

## 🚫 Tests de sécurité et erreurs

### 9. Créer une association sans être connecté (ok)

```http
POST http://localhost:3000/api/associations/create
Content-Type: application/json

{
  "name": "Test Association",
  "email": "test@example.org",
  "phone": "0123456789",
  "address": "Test Address"
}
```

**Résultat attendu** : 401 Unauthorized - "Token requis"

---

### 10. Modifier une association d'un autre gestionnaire (ok)

```http
PATCH http://localhost:3000/api/associations/2
Authorization: Bearer VOTRE_TOKEN_JEAN_ICI
Content-Type: application/json

{
  "name": "Tentative de modification"
}
```

**Note** : Jean (Refuge des 4 Pattes) tente de modifier SOS Matous
**Résultat attendu** : 403 Forbidden - "Accès interdit"

---

### 11. Supprimer une association avec un compte non-admin (ok)

```http
DELETE http://localhost:3000/api/associations/3
Authorization: Bearer VOTRE_TOKEN_JEAN_ICI
```

**Note** : Jean (gestionnaire) tente de supprimer une association
**Résultat attendu** : 403 Forbidden - "Accès interdit - rôle admin requis"

---

### 12. Accéder à une association inexistante (ok)

```http
GET http://localhost:3000/api/associations/999
```

**Résultat attendu** : 404 Not Found - "Association non trouvée"

---

### 13. Créer une association avec email déjà utilisé (ok)

```http
POST http://localhost:3000/api/associations/create
Authorization: Bearer VOTRE_TOKEN_FOSTER_ICI
Content-Type: application/json

{
  "name": "Test Doublon",
  "email": "contact@4pattes.org",
  "phone": "0123456789",
  "address": "Test Address"
}
```

**Résultat attendu** : 400 Bad Request - "Email déjà utilisé"

---

### 14. Créer une association avec des données invalides (ok)

```http
POST http://localhost:3000/api/associations/create
Authorization: Bearer VOTRE_TOKEN_FOSTER_ICI
Content-Type: application/json

{
  "name": "",
  "email": "email_invalide",
  "phone": "",
  "address": ""
}
```

**Résultat attendu** : 400 Bad Request - Erreurs de validation

---

## 📊 Associations de test disponibles

### 🏢 Associations existantes

- **ID 1** : Refuge des 4 Pattes (contact@4pattes.org) - Gestionnaire: Jean Dubois
  - Animaux: Rex, Luna, Max
- **ID 2** : SOS Matous (contact@sosmatous.org) - Gestionnaire: Anne Durand
  - Animaux: Minette, Whiskers, Smokey
- **ID 3** : Amis des Animaux (contact@amisanimaux.fr) - Gestionnaire: Paul Leroy
  - Animaux: Bella, Oscar
- **ID 4** : Refuge du Bonheur (info@refugebonheur.org) - Gestionnaire: Laura Roux
  - Animaux: Rocky, Mimi
- **ID 5** : Protection Animale 33 (contact@pa33.org) - Gestionnaire: Thomas Blanc
  - Animaux: Buddy, Shadow, Coco, Nala

---

## 👥 Comptes pour les tests

### 🏢 Gestionnaires d'associations

- **Jean Dubois** : jean.dubois@4pattes.org (password: admin4pattes) - Association ID 1
- **Anne Durand** : anne.durand@sosmatous.org (password: sosmatous123) - Association ID 2
- **Paul Leroy** : paul.leroy@amisanimaux.fr (password: amisanimaux456) - Association ID 3
- **Laura Roux** : laura.roux@refugebonheur.org (password: bonheur789) - Association ID 4
- **Thomas Blanc** : thomas.blanc@pa33.org (password: protection33) - Association ID 5

### 👤 Fosters (peuvent créer des associations)

- **Marie Dupont** : marie.dupont@example.com (password: marie123)
- **Pierre Bernard** : pierre.bernard@email.fr (password: pierre456)
- **Sophie Moreau** : sophie.moreau@gmail.com (password: sophie789)

### 👑 Admin (peut supprimer des associations)

- **Admin System** : admin@petfosterconnect.com (password: AdminPass123)

---

## 🔄 Workflow de test complet

1. **Consultation publique** → Lister et voir les associations sans authentification
2. **Création d'association** → Un foster crée sa propre association
3. **Modification** → Un gestionnaire modifie son association
4. **Tests de restrictions** → Vérifier qu'on ne peut pas modifier celle des autres
5. **Suppression admin** → Seul l'admin peut supprimer des associations
6. **Tests d'erreurs** → Valider la robustesse de l'API

---

## ⚠️ Notes importantes

- **Les routes GET** sont publiques (pas d'authentification requise)
- **Création** : n'importe quel utilisateur connecté peut créer une association
- **Modification** : seuls les gestionnaires peuvent modifier leur propre association
- **Suppression** : seuls les admins peuvent supprimer des associations
- **Chaque association** ne peut avoir qu'un seul gestionnaire
- **Remplacez** `VOTRE_TOKEN_*_ICI` par les vrais tokens de connexion
- **La suppression d'une association** supprime aussi ses animaux et délie ses gestionnaires
