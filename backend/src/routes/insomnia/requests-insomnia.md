# ✉️ Tests Requests Routes - Guide Insomnia Simple

## 📋 Prérequis

1. **Serveur démarré** : `npm run dev` depuis la racine du projet
2. **Base de données** : PostgreSQL avec les données d'exemple chargées
3. **Insomnia** : Outil de test API installé

---

## 🎯 Tests à réaliser

### 1. ➕ Créer une demande d'accueil (Marie pour Rex) (ok)

**Étape 1** - Connexion Marie (foster) :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "marie.dupont@example.com",
  "password": "marie123"
}
```

**Étape 2** - Créer la demande :

```http
POST http://localhost:3000/api/requests
Authorization: Bearer VOTRE_TOKEN_MARIE_ICI
Content-Type: application/json

{
  "id_animal": 1,
  "message": "Je souhaite accueillir Rex. J'ai de l'expérience avec les bergers allemands et un grand jardin sécurisé."
}
```

**Animal** : Rex (Berger Allemand) du Refuge des 4 Pattes

---

### 2. ➕ Créer une demande d'accueil (Pierre pour Minette) (ok)

**Étape 1** - Connexion Pierre :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "pierre.bernard@email.fr",
  "password": "pierre456"
}
```

**Étape 2** - Créer la demande :

```http
POST http://localhost:3000/api/requests
Authorization: Bearer VOTRE_TOKEN_PIERRE_ICI
Content-Type: application/json

{
  "id_animal": 4,
  "message": "Je peux accueillir Minette dans mon appartement adapté aux chats avec balcon sécurisé."
}
```

**Animal** : Minette (Chartreux) de SOS Matous

---

### 3. 📋 Voir mes demandes (Marie)(ok)

```http
GET http://localhost:3000/api/requests/user
Authorization: Bearer VOTRE_TOKEN_MARIE_ICI
```

**Résultat** : Toutes les demandes faites par Marie (existantes + nouvelles)

---

### 4. 📋 Voir mes demandes (Pierre)(ok)

```http
GET http://localhost:3000/api/requests/user
Authorization: Bearer VOTRE_TOKEN_PIERRE_ICI
```

**Résultat** : Toutes les demandes faites par Pierre

---

### 5. 📥 Voir les demandes reçues (Jean - Refuge des 4 Pattes)(ok)

**Étape 1** - Connexion Jean :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "jean.dubois@4pattes.org",
  "password": "admin4pattes"
}
```

**Étape 2** - Voir les demandes :

```http
GET http://localhost:3000/api/requests/received
Authorization: Bearer VOTRE_TOKEN_JEAN_ICI
```

**Résultat** : Demandes pour les animaux du Refuge des 4 Pattes (Rex, Luna, Max)

---

### 6. 📥 Voir les demandes reçues (Anne - SOS Matous)(ok)

**Étape 1** - Connexion Anne :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "anne.durand@sosmatous.org",
  "password": "sosmatous123"
}
```

**Étape 2** - Voir les demandes :

```http
GET http://localhost:3000/api/requests/received
Authorization: Bearer VOTRE_TOKEN_ANNE_ICI
```

**Résultat** : Demandes pour les chats de SOS Matous (Minette, Whiskers, Smokey)

---

### 7. 👁️ Voir une demande spécifique (demande ID 1)(ok)

```http
GET http://localhost:3000/api/requests/1
Authorization: Bearer VOTRE_TOKEN_MARIE_OU_JEAN_ICI
```

**Demande** : Marie pour Rex (pending)
**Note** : Accessible par Marie (créatrice) ou Jean (association propriétaire)

---

### 8. ✅ Accepter une demande (Jean accepte Marie pour Rex)(ok)

```http
PATCH http://localhost:3000/api/requests/1
Authorization: Bearer VOTRE_TOKEN_JEAN_ICI
Content-Type: application/json

{
  "status": "accepted"
}
```

**Action** : Jean accepte la demande de Marie pour Rex

---

### 9. ❌ Refuser une demande (Anne refuse Pierre pour Minette)(ok)

```http
PATCH http://localhost:3000/api/requests/2
Authorization: Bearer VOTRE_TOKEN_ANNE_ICI
Content-Type: application/json

{
  "status": "refused"
}
```

**Action** : Anne refuse la demande de Pierre pour Minette

---

### 10. ✅ Accepter une demande existante (Thomas accepte Lucas pour Nala)(ok)

**Étape 1** - Connexion Thomas :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "thomas.blanc@pa33.org",
  "password": "protection33"
}
```

**Étape 2** - Accepter la demande :

```http
PATCH http://localhost:3000/api/requests/11
Authorization: Bearer VOTRE_TOKEN_THOMAS_ICI
Content-Type: application/json

{
  "status": "accepted"
}
```

**Demande existante** : Lucas pour Nala (ID 11 - actuellement pending)

---

## 🚫 Tests de sécurité et erreurs

### 11. Créer une demande sans être connecté(ok)

```http
POST http://localhost:3000/api/requests
Content-Type: application/json

{
  "id_animal": 7,
  "message": "Test sans token"
}
```

**Résultat attendu** : 401 Unauthorized - "Token requis"

---

### 12. Créer une demande avec un compte association(ok)

```http
POST http://localhost:3000/api/requests
Authorization: Bearer VOTRE_TOKEN_JEAN_ICI
Content-Type: application/json

{
  "id_animal": 7,
  "message": "Test avec compte association"
}
```

**Résultat attendu** : 403 Forbidden - "Accès interdit - rôle foster requis"

---

### 13. Voir les demandes reçues avec un compte foster(ok)

```http
GET http://localhost:3000/api/requests/received
Authorization: Bearer VOTRE_TOKEN_MARIE_ICI
```

**Résultat attendu** : 403 Forbidden - "Accès interdit - rôle association requis"

---

### 14. Modifier le statut d'une demande avec un compte foster(ok)

```http
PATCH http://localhost:3000/api/requests/3
Authorization: Bearer VOTRE_TOKEN_MARIE_ICI
Content-Type: application/json

{
  "status": "accepted"
}
```

**Résultat attendu** : 403 Forbidden - "Accès interdit - rôle association requis"

---

### 15. Voir une demande d'une autre association(ok)

```http
GET http://localhost:3000/api/requests/2
Authorization: Bearer VOTRE_TOKEN_JEAN_ICI
```

**Note** : Jean (Refuge des 4 Pattes) tente de voir une demande pour SOS Matous
**Résultat attendu** : 403 Forbidden - "Accès interdit"

---

### 16. Modifier une demande d'une autre association(ok)

```http
PATCH http://localhost:3000/api/requests/2
Authorization: Bearer VOTRE_TOKEN_JEAN_ICI
Content-Type: application/json

{
  "status": "accepted"
}
```

**Note** : Jean tente de modifier une demande pour SOS Matous
**Résultat attendu** : 403 Forbidden - "Accès interdit"

---

### 17. Créer une demande pour un animal inexistant(ok)

```http
POST http://localhost:3000/api/requests
Authorization: Bearer VOTRE_TOKEN_MARIE_ICI
Content-Type: application/json

{
  "id_animal": 999,
  "message": "Demande pour animal inexistant"
}
```

**Résultat attendu** : 404 Not Found - "Animal non trouvé"

---

### 18. Modifier avec un statut invalide(ok)

```http
PATCH http://localhost:3000/api/requests/3
Authorization: Bearer VOTRE_TOKEN_JEAN_ICI
Content-Type: application/json

{
  "status": "statut_invalide"
}
```

**Résultat attendu** : 400 Bad Request - Statuts valides: pending, accepted, refused

---

## 📊 Demandes de test disponibles

### ⏳ Demandes en attente (pending)

- **ID 1** : Marie → Rex (Refuge des 4 Pattes)
- **ID 2** : Pierre → Minette (SOS Matous)
- **ID 3** : Sophie → Luna (Refuge des 4 Pattes)
- **ID 4** : Julien → Bella (Amis des Animaux)
- **ID 5** : Camille → Rocky (Refuge du Bonheur)
- **ID 11** : Lucas → Nala (Protection Animale 33)
- **ID 12** : Camille → Oscar (Amis des Animaux)
- **ID 13** : Pierre → Smokey (SOS Matous)

### ✅ Demandes acceptées (accepted)

- **ID 6** : Lucas → Whiskers (SOS Matous)
- **ID 7** : Marie → Shadow (Protection Animale 33)
- **ID 8** : Sophie → Coco (Protection Animale 33)

### ❌ Demandes refusées (refused)

- **ID 9** : Pierre → Buddy (Protection Animale 33)
- **ID 10** : Julien → Oscar (Amis des Animaux)

---

## 👥 Comptes pour les tests

### 👤 Fosters (peuvent créer des demandes)

- **Marie Dupont** : marie.dupont@example.com (password: marie123)
- **Pierre Bernard** : pierre.bernard@email.fr (password: pierre456)
- **Sophie Moreau** : sophie.moreau@gmail.com (password: sophie789)
- **Julien Petit** : julien.petit@outlook.fr (password: julien2025)
- **Camille Rousseau** : camille.rousseau@yahoo.fr (password: camille555)
- **Lucas Martin** : lucas.martin@hotmail.fr (password: lucas999)

### 🏢 Gestionnaires (peuvent gérer les demandes)

- **Jean Dubois** : jean.dubois@4pattes.org (password: admin4pattes) - Refuge des 4 Pattes
- **Anne Durand** : anne.durand@sosmatous.org (password: sosmatous123) - SOS Matous
- **Paul Leroy** : paul.leroy@amisanimaux.fr (password: amisanimaux456) - Amis des Animaux
- **Laura Roux** : laura.roux@refugebonheur.org (password: bonheur789) - Refuge du Bonheur
- **Thomas Blanc** : thomas.blanc@pa33.org (password: protection33) - Protection Animale 33

---

## 🔄 Workflow de test complet

1. **Création de demandes** → Fosters font des demandes pour différents animaux
2. **Consultation côté foster** → Voir ses propres demandes
3. **Consultation côté association** → Voir les demandes reçues
4. **Gestion des demandes** → Accepter/refuser les demandes
5. **Tests de sécurité** → Vérifier les restrictions d'accès
6. **Tests d'erreurs** → Valider la robustesse de l'API

---

## ⚠️ Notes importantes

- **Création** : seuls les fosters peuvent créer des demandes
- **Consultation** : chacun voit ses propres demandes + les associations voient celles reçues
- **Modification** : seules les associations peuvent changer le statut des demandes
- **Accès aux détails** : propriétaire de la demande OU association propriétaire de l'animal
- **Statuts valides** : "pending", "accepted", "refused"
- **Remplacez** `VOTRE_TOKEN_*_ICI` par les vrais tokens de connexion
