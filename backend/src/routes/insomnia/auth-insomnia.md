# 🔐 Tests Auth Routes - Guide Insomnia Simple

## 📋 Prérequis

1. **Serveur démarré** : `npm run dev` depuis la racine du projet
2. **Base de données** : PostgreSQL avec les données d'exemple chargées
3. **Insomnia** : Outil de test API installé

---

## 🎯 Tests à réaliser

### 1. 📋 Voir les endpoints disponibles (ok)

```http
GET http://localhost:3000/api/auth
```

**Résultat** : Liste de tous les endpoints d'authentification

---

### 2. 👤 Inscription d'un nouveau foster (ok)

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "first_name": "Alex",
  "last_name": "Testeur",
  "email": "alex.testeur@email.fr",
  "password": "motdePasse123"
}
```

**Note** : Crée automatiquement un compte avec le rôle "foster"

---

### 3. 🔓 Connexion admin (ok)

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@petfosterconnect.com",
  "password": "AdminPass123"
}
```

**➡️ Copiez le token pour les tests suivants**

---

### 4. 🔓 Connexion foster (Marie) (ok)

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "marie.dupont@example.com",
  "password": "marie123"
}
```

---

### 5. 🔓 Connexion gestionnaire association (ok)

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "jean.dubois@4pattes.org",
  "password": "admin4pattes"
}
```

---

### 6. 👁️ Voir son profil (ok)

```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Résultat** : Informations complètes de l'utilisateur connecté

---

### 7. 🔀 Changer de rôle (foster ↔ association) (ok)

```http
POST http://localhost:3000/api/auth/switch-role
Authorization: Bearer VOTRE_TOKEN_GESTIONNAIRE_ICI
Content-Type: application/json

{
  "role": "foster"
}
```

**⚠️ Note importante** :

- Seuls les **gestionnaires d'association** peuvent changer de rôle
- Il faut être rattaché à une association (`id_association` non null)
- Les fosters purs ne peuvent pas devenir gestionnaires d'association
- Exemple : Utilisez le token de Jean Dubois pour tester

**Exemple retour en mode association** :

```http
POST http://localhost:3000/api/auth/switch-role
Authorization: Bearer VOTRE_TOKEN_GESTIONNAIRE_ICI
Content-Type: application/json

{
  "role": "association"
}
```

---

### 8. 🚪 Déconnexion (ok)

```http
POST http://localhost:3000/api/auth/logout
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Note** : Invalide le token côté client

---

## 🚫 Tests d'erreurs

### 9. Connexion avec mauvais mot de passe (ok)

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "marie.dupont@example.com",
  "password": "mauvais_mot_de_passe"
}
```

**Résultat attendu** : 401 Unauthorized

---

### 10. Connexion avec email inexistant (ok)

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "utilisateur.inexistant@email.com",
  "password": "motdepasse"
}
```

**Résultat attendu** : 401 Unauthorized

---

### 11. Inscription avec email déjà utilisé (ok)

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "first_name": "Test",
  "last_name": "Doublon",
  "email": "marie.dupont@example.com",
  "password": "motdepasse123"
}
```

**Résultat attendu** : 400 Bad Request - Email déjà utilisé

---

### 12. Accès au profil sans token (ok)

```http
GET http://localhost:3000/api/auth/profile
```

**Résultat attendu** : 401 Unauthorized - "Token requis"

---

### 13. Accès au profil avec token invalide (ok)

```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer token_invalide_123
```

**Résultat attendu** : 401 Unauthorized - "Token invalide"

---

### 14. Switch-role avec foster pur (erreur) (ok)

```http
POST http://localhost:3000/api/auth/switch-role
Authorization: Bearer TOKEN_FOSTER_PUR_ICI
Content-Type: application/json

{
  "role": "association"
}
```

**Résultat attendu** : 400 Bad Request - "Vous devez être rattaché à une association pour changer de rôle"

---

### 15. Switch-role avec rôle invalide (ok)

```http
POST http://localhost:3000/api/auth/switch-role
Authorization: Bearer VOTRE_TOKEN_GESTIONNAIRE_ICI
Content-Type: application/json

{
  "role": "admin"
}
```

**Résultat attendu** : 400 Bad Request - Validation error

---

## 📊 Comptes de test disponibles

### 👑 Admin

- **Email** : admin@petfosterconnect.com
- **Password** : AdminPass123

### 👤 Fosters (familles d'accueil)

- **Marie Dupont** : marie.dupont@example.com (password: marie123)
- **Pierre Bernard** : pierre.bernard@email.fr (password: pierre456)
- **Sophie Moreau** : sophie.moreau@gmail.com (password: sophie789)
- **Julien Petit** : julien.petit@outlook.fr (password: julien2025)
- **Camille Rousseau** : camille.rousseau@yahoo.fr (password: camille555)
- **Lucas Martin** : lucas.martin@hotmail.fr (password: lucas999)

### 🏢 Gestionnaires d'associations

- **Jean Dubois** : jean.dubois@4pattes.org (password: admin4pattes) - Refuge des 4 Pattes
- **Anne Durand** : anne.durand@sosmatous.org (password: sosmatous123) - SOS Matous
- **Paul Leroy** : paul.leroy@amisanimaux.fr (password: amisanimaux456) - Amis des Animaux
- **Laura Roux** : laura.roux@refugebonheur.org (password: bonheur789) - Refuge du Bonheur
- **Thomas Blanc** : thomas.blanc@pa33.org (password: protection33) - Protection Animale 33

---

## 🔄 Workflow de test complet

1. **Inscription** → Créer un nouveau compte
2. **Connexion** → Tester différents types de comptes
3. **Profil** → Vérifier les informations utilisateur
4. **Switch role** → Tester le changement de rôle
5. **Tests d'erreurs** → Vérifier la sécurité
6. **Déconnexion** → Finaliser la session

---

## ⚠️ Notes importantes

- **Remplacez** `VOTRE_TOKEN_ICI` par le vrai token de connexion
- **L'inscription** crée toujours un compte foster par défaut
- **Le switch role** : Seuls les gestionnaires d'association peuvent changer de rôle (foster ↔ association)
- **Restriction switch-role** : Les fosters purs (sans `id_association`) ne peuvent pas devenir gestionnaires
- **Les tokens** sont nécessaires pour toutes les routes protégées
- **Testez les erreurs** pour vérifier la sécurité de l'API
