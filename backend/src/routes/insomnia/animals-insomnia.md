# 🐾 Tests Animals Routes - Guide Insomnia Simple

## 📋 Prérequis

1. **Serveur démarré** : `npm run dev` depuis la racine du projet
2. **Base de données** : PostgreSQL avec les données d'exemple chargées
3. **Insomnia** : Outil de test API installé

---

## 🎯 Tests à réaliser

### 1. 📋 Lister tous les animaux (public)(ok)

```http
GET http://localhost:3000/api/animals
```

**Résultat** : Liste paginée de tous les animaux disponibles

---

### 2. 📋 Lister avec paramètres de pagination (ok)

```http
GET http://localhost:3000/api/animals?page=1&limit=5
```

**Résultat** : 5 premiers animaux avec infos de pagination

---

### 3. 👁️ Voir un animal spécifique - Rex (ok)

```http
GET http://localhost:3000/api/animals/1
```

**Animal** : Rex - Berger Allemand du Refuge des 4 Pattes

---

### 4. 👁️ Voir un animal spécifique - Nala (ok)

```http
GET http://localhost:3000/api/animals/14
```

**Animal** : Nala - Chat Bengal de Protection Animale 33

---

### 5. ➕ Créer un nouvel animal (Jean - Refuge des 4 Pattes) (ok)

**Étape 1** - Connexion gestionnaire :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "jean.dubois@4pattes.org",
  "password": "admin4pattes"
}
```

**Étape 2** - Créer l'animal :

```http
POST http://localhost:3000/api/animals
Authorization: Bearer VOTRE_TOKEN_ASSOCIATION_ICI
Content-Type: application/json

{
  "name": "Toby",
  "species": "Chien",
  "breed": "Husky",
  "age": 3,
  "description": "Chien énergique qui adore les longues promenades. Très sociable avec les autres chiens.",
  "photo_url": "https://example.com/photos/toby.jpg",
  "status": "disponible"
}
```

---

### 6. ✏️ Modifier un animal existant (Jean modifie Rex) (ok)

```http
PATCH http://localhost:3000/api/animals/1
Authorization: Bearer VOTRE_TOKEN_JEAN_ICI
Content-Type: application/json

{
  "description": "Gentil chien protecteur, très loyal et obéissant. Parfait pour une famille expérimentée. MISE À JOUR : Très calme avec les enfants.",
  "age": 6
}
```

**Note** : Jean peut modifier Rex car ils appartiennent à la même association
**✅ Modification partielle** : Seuls les champs envoyés sont modifiés

**Exemple - Changer seulement le statut** :

```http
PATCH http://localhost:3000/api/animals/1
Authorization: Bearer VOTRE_TOKEN_JEAN_ICI
Content-Type: application/json

{
  "status": "accueilli"
}
```

---

### 7. ➕ Créer un animal (Anne - SOS Matous) (ok)

**Étape 1** - Connexion Anne :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "anne.durand@sosmatous.org",
  "password": "sosmatous123"
}
```

**Étape 2** - Créer un chat :

```http
POST http://localhost:3000/api/animals
Authorization: Bearer VOTRE_TOKEN_ANNE_ICI
Content-Type: application/json

{
  "name": "Félix",
  "species": "Chat",
  "breed": "Européen",
  "age": 2,
  "description": "Chat joueur et affectueux, parfait pour une première adoption.",
  "photo_url": "https://example.com/photos/felix.jpg",
  "status": "disponible"
}
```

---

## 🚫 Tests de sécurité et erreurs

### 8. Créer un animal sans être connecté (ok)

```http
POST http://localhost:3000/api/animals
Content-Type: application/json

{
  "name": "Test",
  "species": "Chat",
  "breed": "Test",
  "age": 1,
  "description": "Test",
  "status": "disponible"
}
```

**Résultat attendu** : 401 Unauthorized - "Token requis"

---

### 9. Créer un animal avec un compte foster

**Étape 1** - Connexion foster :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "marie.dupont@example.com",
  "password": "marie123"
}
```

**Étape 2** - Tentative de création :

```http
POST http://localhost:3000/api/animals
Authorization: Bearer VOTRE_TOKEN_FOSTER_ICI
Content-Type: application/json

{
  "name": "Test",
  "species": "Chat",
  "breed": "Test",
  "age": 1,
  "description": "Test",
  "status": "disponible"
}
```

**Résultat attendu** : 403 Forbidden - "Permissions insuffisantes"

---

### 10. Modifier un animal d'une autre association (ok)

```http
PATCH http://localhost:3000/api/animals/4
Authorization: Bearer VOTRE_TOKEN_JEAN_ICI
Content-Type: application/json

{
  "description": "Tentative de modification"
}
```

**Note** : Jean (Refuge des 4 Pattes) tente de modifier Minette (SOS Matous)
**Résultat attendu** : 403 Forbidden - "Vous ne pouvez modifier que les animaux de votre association"

---

### 11. Accéder à un animal inexistant (ok)

```http
GET http://localhost:3000/api/animals/999
```

**Résultat attendu** : 404 Not Found - "Animal non trouvé"

---

### 12. Créer un animal avec des données invalides (ok)

```http
POST http://localhost:3000/api/animals
Authorization: Bearer VOTRE_TOKEN_ASSOCIATION_ICI
Content-Type: application/json

{
  "name": "",
  "species": "",
  "age": -1,
  "status": "statut_invalide"
}
```

**Résultat attendu** : 400 Bad Request - Erreurs de validation

---

## 📊 Animaux de test disponibles

### 🏢 Refuge des 4 Pattes (Jean Dubois)

- **ID 1** : Rex - Berger Allemand, 5 ans, disponible
- **ID 2** : Luna - Golden Retriever, 3 ans, disponible
- **ID 3** : Max - Labrador, 7 ans, accueilli

### 🐱 SOS Matous (Anne Durand)

- **ID 4** : Minette - Chartreux, 2 ans, disponible
- **ID 5** : Whiskers - Maine Coon, 4 ans, disponible
- **ID 6** : Smokey - British Shorthair, 1 an, disponible

### 🦮 Amis des Animaux (Paul Leroy)

- **ID 7** : Bella - Border Collie, 2 ans, disponible
- **ID 8** : Oscar - Persan, 6 ans, disponible

### 🐕 Refuge du Bonheur (Laura Roux)

- **ID 9** : Rocky - Bulldog Français, 4 ans, disponible
- **ID 10** : Mimi - Siamois, 3 ans, accueilli

### 🐾 Protection Animale 33 (Thomas Blanc)

- **ID 11** : Buddy - Beagle, 5 ans, disponible
- **ID 12** : Shadow - Chat de gouttière, 2 ans, disponible
- **ID 13** : Coco - Cocker Spaniel, 6 ans, disponible
- **ID 14** : Nala - Bengal, 1 an, disponible

---

## 👥 Comptes gestionnaires pour les tests

- **Jean Dubois** : jean.dubois@4pattes.org (password: admin4pattes)
- **Anne Durand** : anne.durand@sosmatous.org (password: sosmatous123)
- **Paul Leroy** : paul.leroy@amisanimaux.fr (password: amisanimaux456)
- **Laura Roux** : laura.roux@refugebonheur.org (password: bonheur789)
- **Thomas Blanc** : thomas.blanc@pa33.org (password: protection33)

---

## 🔄 Workflow de test complet

1. **Consultation publique** → Lister et voir les animaux sans authentification
2. **Connexion association** → Obtenir un token gestionnaire
3. **Création d'animaux** → Ajouter de nouveaux animaux
4. **Modification** → Mettre à jour les informations
5. **Tests de sécurité** → Vérifier les restrictions d'accès
6. **Tests d'erreurs** → Valider la robustesse de l'API

---

## ⚠️ Notes importantes

- **Les routes GET** sont publiques (pas d'authentification requise)
- **Création/modification** nécessitent un compte association
- **Chaque association** ne peut gérer que ses propres animaux
- **Remplacez** `VOTRE_TOKEN_*_ICI` par les vrais tokens de connexion
- **Les statuts valides** sont : "disponible" et "accueilli"
