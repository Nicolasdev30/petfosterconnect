# Les Use Cases : scénarios plus complets que les User Stories, qui décrivent les interactions entre les utilisateurs et le système

## 📋 Tableau des Use Cases - Pet Foster Connect

| Code US    | Use Case                                      | Acteur(s)             | Pré-conditions                 | Déclencheur             | Actions principales                                                                                                                            | Post-conditions                     | Tables impactées              |
| ---------- | --------------------------------------------- | --------------------- | ------------------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------- |
| **US-001** | **S'inscrire en tant que nouvel utilisateur** | Visiteur              | Aucun compte existant          | Clic "Créer un compte"  | 1. Choix du rôle (foster/association)<br>2. Saisie informations personnelles<br>3. Validation email<br>4. Hashage mot de passe (Argon2)        | Compte créé et activé               | `user`, `role`                |
| **US-002** | **Se connecter à la plateforme**              | Tous utilisateurs     | Compte existant                | Clic "Se connecter"     | 1. Saisie email + mot de passe<br>2. Vérification hash Argon2<br>3. Génération token JWT<br>4. Redirection selon rôle                          | Session ouverte                     | `user`, `role`                |
| **US-003** | **Rechercher/Consulter les animaux**          | Visiteur, Famille     | Aucune                         | Visite page `/animals`  | 1. Affichage liste animaux disponibles<br>2. Filtres par espèce, âge, association<br>3. Tri par date disponibilité<br>4. Accès fiche détaillée | Liste filtrée affichée              | `animal`, `association`       |
| **US-004** | **Consulter détail d'un animal**              | Visiteur, Famille     | Animal existant                | Clic sur animal         | 1. Affichage fiche complète<br>2. Photos, description, race<br>3. Infos association propriétaire<br>4. Bouton "Demander accueil" si connecté   | Fiche détaillée visible             | `animal`, `association`       |
| **US-005** | **Faire une demande d'accueil**               | Famille connectée     | Connecté + animal disponible   | Clic "Demander accueil" | 1. Rédaction message personnalisé<br>2. Validation demande<br>3. Enregistrement avec statut 'pending'<br>4. Notification à l'association       | Demande créée                       | `request`, `animal`, `user`   |
| **US-006** | **Consulter mes demandes**                    | Famille connectée     | Session active                 | Menu "Mes demandes"     | 1. Liste demandes par statut<br>2. Historique complet<br>3. Détails animal demandé<br>4. Messages échangés                                     | Dashboard demandes affiché          | `request`, `animal`           |
| **US-007** | **Annuler une demande**                       | Famille connectée     | Demande en 'pending'           | Clic "Annuler"          | 1. Confirmation action<br>2. Suppression ou marquage annulé<br>3. Notification association                                                     | Demande supprimée/annulée           | `request`                     |
| **US-008** | **Gérer les demandes reçues**                 | Association connectée | Demandes sur ses animaux       | Menu "Demandes reçues"  | 1. Liste par animal<br>2. Consultation profil famille<br>3. Lecture message<br>4. Actions Accepter/Refuser                                     | Dashboard demandes visible          | `request`, `animal`, `user`   |
| **US-009** | **Accepter une demande**                      | Association connectée | Demande 'pending'              | Clic "Accepter"         | 1. Changement statut → 'accepted'<br>2. Animal → statut 'fostered'<br>3. Notification famille<br>4. Refus autres demandes                      | Demande acceptée, animal en accueil | `request`, `animal`           |
| **US-010** | **Refuser une demande**                       | Association connectée | Demande 'pending'              | Clic "Refuser"          | 1. Changement statut → 'refused'<br>2. Message de refus optionnel<br>3. Notification famille                                                   | Demande refusée                     | `request`                     |
| **US-011** | **Ajouter un animal**                         | Association connectée | Session active association     | Clic "Ajouter animal"   | 1. Formulaire complet<br>2. Upload photo<br>3. Statut initial 'disponible'<br>4. Association auto-assignée                                     | Animal créé et visible              | `animal`                      |
| **US-012** | **Modifier un animal**                        | Association connectée | Animal existant + propriétaire | Clic "Modifier"         | 1. Édition informations<br>2. Changement statut possible<br>3. Mise à jour photo<br>4. Sauvegarde modifications                                | Animal mis à jour                   | `animal`                      |
| **US-013** | **Supprimer un animal**                       | Association connectée | Animal existant + propriétaire | Clic "Supprimer"        | 1. Vérification pas de demandes actives<br>2. Confirmation suppression<br>3. Soft delete ou suppression                                        | Animal supprimé/archivé             | `animal`, `request`           |
| **US-014** | **Gérer mes animaux**                         | Association connectée | Session active                 | Menu "Mes animaux"      | 1. Liste complète par statut<br>2. Statistiques adoptions<br>3. Actions rapides<br>4. Recherche/filtres                                        | Dashboard animaux affiché           | `animal`, `request`           |
| **US-015** | **Marquer animal adopté**                     | Association connectée | Animal 'fostered'              | Action spéciale         | 1. Changement → 'accueilli'<br>2. Date d'adoption<br>3. Archivage demandes<br>4. Mise à jour stats                                             | Animal marqué adopté                | `animal`, `request`           |
| **US-016** | **Consulter/Modifier profil**                 | Tous connectés        | Session active                 | Menu "Mon profil"       | 1. Affichage données actuelles<br>2. Modification informations<br>3. Changement mot de passe<br>4. Mise à jour associations                    | Profil mis à jour                   | `user`, `association`         |
| **US-017** | **Se déconnecter**                            | Tous connectés        | Session active                 | Clic "Déconnexion"      | 1. Invalidation token<br>2. Suppression session<br>3. Redirection accueil                                                                      | Session fermée                      | Aucune                        |
| **US-018** | **Inscription association**                   | Visiteur              | Aucun compte                   | Processus spécial       | 1. Formulaire association<br>2. Informations légales<br>3. Validation manuelle<br>4. Création compte manager                                   | Association et compte créés         | `association`, `user`, `role` |
| **US-019** | **Récupérer mot de passe**                    | Utilisateur           | Email valide                   | "Mot de passe oublié"   | 1. Saisie email<br>2. Génération token reset<br>3. Envoi email<br>4. Reset + nouveau hash                                                      | Mot de passe réinitialisé           | `user`                        |
| **US-020** | **Filtrer animaux avancé**                    | Tous                  | Liste animaux                  | Utilisation filtres     | 1. Critères multiples<br>2. Recherche textuelle<br>3. Tri personnalisé<br>4. Pagination résultats                                              | Résultats filtrés                   | `animal`, `association`       |
| **US-021** | **Supprimer un utilisateur**                  | Admin                 | Utilisateur existant           | Clic "Supprimer"        | 1. Recherche utilisateur<br>2. Suppression utilisateur                                                                                         | Utilisateur supprimé                | `user`                        |
| **US-022** | **Supprimer une association**                 | Admin                 | Association existant           | Clic "Supprimer"        | 1. Recherche association<br>2. Suppression association                                                                                         | Association supprimée               | `association`                 |
| **US-023** | **Supprimer un animal**                       | Admin                 | Animal existant                | Clic "Supprimer"        | 1. Recherche animal<br>2. Suppression animal                                                                                                   | Animal supprimé                     | `animal`                      |

## 🎯 Priorisation pour le développement

### **🚀 MVP (Version 1.0) - Priorité P1**

| Use Case               | Justification                             |
| ---------------------- | ----------------------------------------- |
| US-001, US-002, US-017 | **Authentification complète**             |
| US-003, US-004         | **Consultation animaux** (core feature)   |
| US-005, US-006         | **Demandes familles** (processus central) |
| US-008, US-009, US-010 | **Gestion demandes associations**         |
| US-011, US-014         | **Gestion animaux basique**               |

### **📈 Version 1.1 - Priorité P2**

| Use Case       | Justification            |
| -------------- | ------------------------ |
| US-007         | **Annulation demandes**  |
| US-012, US-013 | **CRUD animaux complet** |
| US-015         | **Workflow adoption**    |
| US-016         | **Gestion profils**      |
| US-020         | **Recherche avancée**    |

### **🔮 Version 2.0 - Priorité P3**

| Use Case | Justification                 |
| -------- | ----------------------------- |
| US-018   | **Processus associations**    |
| US-019   | **Récupération mot de passe** |

## 📊 Cohérence avec la base de données

### **Tables principales utilisées :**

- **`role`** : Gestion des rôles (foster, association)
- **`user`** : Tous les utilisateurs avec authentification Argon2
- **`association`** : Organisations gérant les animaux
- **`animal`** : Animaux avec statuts (disponible, fostered, accueilli)
- **`request`** : Demandes d'accueil avec workflow complet

### **Statuts cohérents :**

- **Animal** : `disponible` → `fostered` → `accueilli`
- **Request** : `pending` → `accepted`/`refused`
- **User types** : `foster`, `association_manager`

### **Contraintes respectées :**

- **Clés étrangères** : `user.id_role`, `user.id_association`, `animal.id_association`, `request.id_user`, `request.id_animal`
- **Contraintes CHECK** : statuts animal, statuts request, types user
- **Relations logiques** : une association gère ses animaux, une famille fait des demandes

## 🔄 Workflow des statuts

### **Cycle de vie d'un animal :**

```
disponible → fostered → accueilli
     ↑         ↓
     └─── (retour si échec accueil)
```

### **Cycle de vie d'une demande :**

```
pending → accepted (animal devient fostered)
   ↓
refused (animal reste disponible)
```

## 🚀 Mapping avec les données d'exemple

### **Utilisateurs de test disponibles :**

- **Familles** : Marie, Pierre, Sophie, Julien, Camille
- **Associations** : Jean (4 Pattes), Anne (SOS Matous), Paul (Amis des Animaux), Laura (Refuge du Bonheur), Thomas (Protection Animale 33)

### **Données cohérentes :**

- **12 animaux** répartis dans 5 associations
- **12 demandes** avec différents statuts
- **Mots de passe Argon2** avec commentaires pour le dev
- **Statuts réalistes** reflétant les use cases
