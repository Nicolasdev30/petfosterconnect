# 🔒 Tests Admin Routes - Guide Insomnia Simple

## 📋 Prérequis

1. **Serveur démarré** : `npm run dev` depuis la racine du projet
2. **Base de données** : PostgreSQL avec les données d'exemple chargées
3. **Insomnia** : Outil de test API installé

---

## 🎯 Tests à réaliser

### 1. 🔐 Obtenir le token admin (ok)

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@petfosterconnect.com",
  "password": "AdminPass123"
}
```

**➡️ Copiez le token de la réponse pour les tests suivants**

---

### 2. 🗑️ Supprimer Marie Dupont (foster) (ok)

```http
DELETE http://localhost:3000/api/admin/users/1
Authorization: Bearer VOTRE_TOKEN_ADMIN_ICI
```

**Utilisateur** : Marie Dupont (marie.dupont@example.com)

---

### 3. 🗑️ Supprimer Jean Dubois (gestionnaire) (ok)

```http
DELETE http://localhost:3000/api/admin/users/7
Authorization: Bearer VOTRE_TOKEN_ADMIN_ICI
```

**Utilisateur** : Jean Dubois - gestionnaire du "Refuge des 4 Pattes"

---

### 4. 🏢 Supprimer l'association "Protection Animale 33" (ok)

```http
DELETE http://localhost:3000/api/admin/associations/5
Authorization: Bearer VOTRE_TOKEN_ADMIN_ICI
```

**Association** : Protection Animale 33 (contact@pa33.org)
**⚠️ Suppression en cascade** :

- ✅ 3 animaux supprimés (Buddy, Shadow, Coco)
- ✅ 1 gestionnaire détaché (Thomas Blanc devient foster)
- ✅ Toutes les demandes liées supprimées

---

### 5. 🐾 Supprimer l'animal Rex (ok)

```http
DELETE http://localhost:3000/api/admin/animals/1
Authorization: Bearer VOTRE_TOKEN_ADMIN_ICI
```

**Animal** : Rex - Berger Allemand de 5 ans (Refuge des 4 Pattes)

---

## 🚫 Tests de sécurité (doivent échouer)

### 6. Test avec utilisateur foster

**Étape 1** - Connexion foster :

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "pierre.bernard@email.fr",
  "password": "pierre456"
}
```

**Étape 2** - Tentative d'action admin (doit être refusée) :

```http
DELETE http://localhost:3000/api/admin/users/3
Authorization: Bearer TOKEN_FOSTER_ICI
```

**Résultat attendu** : 403 Forbidden

---

### 7. Test sans token

```http
DELETE http://localhost:3000/api/admin/users/4
```

**Résultat attendu** : 401 Unauthorized - "Token requis"

---

### 8. Test avec token invalide

```http
DELETE http://localhost:3000/api/admin/users/5
Authorization: Bearer token_bidon_123
```

**Résultat attendu** : 401 Unauthorized - "Token invalide"

---

## 📊 Données de test (de data.exemples.sql)

### 👤 Utilisateurs foster

- **ID 1** : Marie Dupont - marie.dupont@example.com (password: marie123)
- **ID 2** : Pierre Bernard - pierre.bernard@email.fr (password: pierre456)
- **ID 3** : Sophie Moreau - sophie.moreau@gmail.com (password: sophie789)

### 🏢 Gestionnaires d'associations

- **ID 7** : Jean Dubois - jean.dubois@4pattes.org (password: admin4pattes)
- **ID 8** : Anne Durand - anne.durand@sosmatous.org (password: sosmatous123)
- ~~**ID 11** : Thomas Blanc - Détaché et redevenu foster après suppression de l'association~~

### 🏢 Associations

- **ID 1** : Refuge des 4 Pattes (contact@4pattes.org)
- **ID 2** : SOS Matous (contact@sosmatous.org)
- **ID 3** : Amis des Animaux (contact@amisanimaux.fr)
- **ID 4** : Refuge du Bonheur (info@refugebonheur.org)
- ~~**ID 5** : Protection Animale 33 - Supprimée avec success~~

### 🐾 Animaux

- **ID 1** : Rex - Berger Allemand (Refuge des 4 Pattes)
- **ID 7** : Bella - Border Collie (Amis des Animaux)
- **ID 8** : Oscar - Chat Persan (Amis des Animaux)
- ~~**ID 11, 12, 13, 14** : Supprimés avec l'association Protection Animale 33~~

### 👑 Admin

- **ID 12** : Admin System - admin@petfosterconnect.com (password: AdminPass123)

---

## ⚠️ Notes importantes

- **Ces tests modifient vraiment la base de données !**
- Testez dans l'ordre pour éviter les erreurs
- Pour recharger les données : redémarrez le serveur ou exécutez le fichier SQL
- Remplacez `VOTRE_TOKEN_ADMIN_ICI` par le vrai token de connexion
