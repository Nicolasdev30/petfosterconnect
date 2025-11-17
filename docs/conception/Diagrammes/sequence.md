# Diagramme de Séquence - Pet Foster Connect

Ce diagramme illustre les interactions complètes entre les utilisateurs (familles d'accueil et associations) et le système Pet Foster Connect.

@startuml
title Diagramme de Séquence - Pet Foster Connect

actor "Famille d'Accueil" as Famille
actor "Association" as Asso
participant "Frontend React" as Frontend
participant "API Node.js" as Backend
participant "Middleware Auth" as Auth
database "PostgreSQL" as DB

== Création de compte ==
Famille -> Frontend : Remplit formulaire inscription
Frontend -> Backend : POST /auth/register (firstName, lastName, email, password, role='foster')
Backend -> DB : INSERT INTO user (hash Argon2)
DB --> Backend : 201 Created
Backend --> Frontend : 201 Created + message succès
Frontend --> Famille : "Compte créé, connectez-vous"

== Connexion ==
Famille -> Frontend : Saisit email + password
Frontend -> Backend : POST /auth/login (email, password)
Backend -> DB : SELECT user WHERE email
DB --> Backend : user + hash
Backend -> Backend : Vérifie hash Argon2
alt Succès
    Backend --> Frontend : 200 OK + JWT
    Frontend -> Frontend : Stocke JWT (cookie HTTP-Only)
    Frontend --> Famille : Redirection /dashboard
else Échec
    Backend --> Frontend : 401 Unauthorized
    Frontend --> Famille : "Identifiants incorrects"
end

== Affichage animaux (Public) ==
Famille -> Frontend : Accède /animals
Frontend -> Backend : GET /api/animals
Backend -> DB : SELECT animal LEFT JOIN association ORDER BY id_animal DESC
DB --> Backend : Liste animaux + associations
Backend --> Frontend : 200 OK + JSON (animals + pagination)
Frontend --> Famille : Affiche cartes animaux

== Consulter détails animal ==
Famille -> Frontend : Clique "Voir plus"
Frontend -> Backend : GET /api/animals/:id
Backend -> DB : SELECT animal WHERE id_animal=:id INCLUDE association
DB --> Backend : animal + association
alt Animal trouvé
    Backend --> Frontend : 200 OK + JSON animal
    Frontend --> Famille : Affiche détails + bouton "Demander"
else Introuvable
    Backend --> Frontend : 404 Not Found
    Frontend --> Famille : Page 404
end

== Famille : Créer demande accueil ==
Famille -> Frontend : Clique "Faire une demande"
Frontend -> Frontend : Vérifie JWT présent
alt Non connecté
    Frontend --> Famille : Redirection /login
else Connecté
    Famille -> Frontend : Remplit message motivation
    Frontend -> Backend : POST /api/requests (id_animal, message) + JWT
    Backend -> Auth : Vérifie JWT, extrait userId
    Auth --> Backend : userId validé
    Backend -> DB : INSERT INTO request (id_user, id_animal, message, status='pending')
    DB --> Backend : 201 Created
    Backend --> Frontend : 201 Created + succès
    Frontend --> Famille : "Demande envoyée !" + redirect /dashboard/requests
end

== Famille : Consulter demandes ==
Famille -> Frontend : Accède /dashboard/requests
Frontend -> Backend : GET /api/requests/user + JWT
Backend -> Auth : Vérifie JWT, extrait userId
Auth --> Backend : userId validé
Backend -> DB : SELECT request WHERE id_user=userId INCLUDE animal
DB --> Backend : Liste demandes + animaux
Backend --> Frontend : 200 OK + JSON requests
Frontend --> Famille : Affiche demandes (pending/accepted/refused)

== Association : Connexion ==
Asso -> Frontend : Se connecte (email + password)
Frontend -> Backend : POST /auth/login
Backend -> DB : SELECT user WHERE email
DB --> Backend : user + id_association
Backend -> Backend : Vérifie hash Argon2
Backend --> Frontend : 200 OK + JWT (contient userId + id_association)
Frontend --> Asso : Redirection /dashboard

== Association : Consulter demandes reçues ==
Asso -> Frontend : Accède /dashboard/requests
Frontend -> Backend : GET /api/requests/received + JWT
Backend -> Auth : Vérifie JWT, extrait id_association
Auth --> Backend : id_association validé
Backend -> DB : SELECT request JOIN animal WHERE animal.id_association=:id INCLUDE user
DB --> Backend : demandes pour ses animaux
Backend --> Frontend : 200 OK + JSON requests
Frontend --> Asso : Affiche demandes + infos famille

== Association : Accepter/Refuser demande ==
Asso -> Frontend : Clique "Accepter" ou "Refuser"
Frontend -> Backend : PATCH /api/requests/:id (status='accepted'/'refused') + JWT
Backend -> Auth : Vérifie JWT, extrait id_association
Auth --> Backend : Association validée
Backend -> DB : SELECT request JOIN animal WHERE id_request=:id
DB --> Backend : demande + animal
Backend -> Backend : Vérifie animal.id_association = user.id_association
alt Autorisé
    Backend -> DB : UPDATE request SET status WHERE id_request=:id
    DB --> Backend : 200 OK
    Backend --> Frontend : 200 OK + succès
    Frontend --> Asso : "Demande traitée !"
else Non autorisé
    Backend --> Frontend : 403 Forbidden
    Frontend --> Asso : "Non autorisé"
end

== Association : Gérer animaux ==
Asso -> Frontend : Accède /dashboard/animals
Frontend -> Backend : GET /api/animals + JWT
Backend -> Auth : Vérifie JWT, extrait id_association
Auth --> Backend : id_association validé
Backend -> DB : SELECT animal WHERE id_association=:id
DB --> Backend : animaux de l'association
Backend --> Frontend : 200 OK + JSON animals
Frontend --> Asso : Liste animaux (Modifier/Supprimer)

== Association : Créer animal ==
Asso -> Frontend : Clique "Créer animal"
Frontend -> Asso : Formulaire (nom, espèce, race, âge, sexe, description, photo_url)
Asso -> Frontend : Soumet formulaire
Frontend -> Backend : POST /api/animals (data) + JWT
Backend -> Auth : Vérifie JWT, role='association'
Auth --> Backend : Autorisé
Backend -> Backend : Ajoute id_association depuis JWT
Backend -> DB : INSERT INTO animal (id_association, status='disponible')
DB --> Backend : 201 Created + animal
Backend --> Frontend : 201 Created + JSON animal
Frontend --> Asso : "Animal créé !"

== Association : Modifier animal ==
Asso -> Frontend : Clique "Modifier"
Frontend -> Asso : Formulaire pré-rempli
Asso -> Frontend : Modifie + soumet
Frontend -> Backend : PATCH /api/animals/:id (data) + JWT
Backend -> Auth : Vérifie JWT
Auth --> Backend : id_association validé
Backend -> DB : SELECT animal WHERE id_animal=:id
DB --> Backend : animal
Backend -> Backend : Vérifie animal.id_association = user.id_association
alt Autorisé
    Backend -> DB : UPDATE animal WHERE id_animal=:id
    DB --> Backend : 200 OK
    Backend --> Frontend : 200 OK + animal mis à jour
    Frontend --> Asso : "Animal modifié !"
else Non autorisé
    Backend --> Frontend : 403 Forbidden
    Frontend --> Asso : "Vous ne pouvez modifier que vos animaux"
end

== Association : Supprimer animal ==
Asso -> Frontend : Clique "Supprimer" + confirme
Frontend -> Backend : DELETE /api/animals/:id + JWT
Backend -> Auth : Vérifie JWT
Auth --> Backend : id_association validé
Backend -> DB : SELECT animal WHERE id_animal=:id
DB --> Backend : animal
Backend -> Backend : Vérifie ownership
alt Autorisé
    Backend -> DB : DELETE FROM request WHERE id_animal=:id (cascade)
    Backend -> DB : DELETE FROM animal WHERE id_animal=:id
    DB --> Backend : 200 OK
    Backend --> Frontend : 200 OK
    Frontend --> Asso : "Animal supprimé"
else Non autorisé
    Backend --> Frontend : 403 Forbidden
    Frontend --> Asso : "Accès refusé"
end

@enduml

## Sécurité Implémentée

### Authentification
- JWT stocké en cookie HTTP-Only (sécurisé, protection XSS)
- Vérification du token à chaque requête protégée
- userId/id_association extrait du JWT côté backend (jamais envoyé par frontend)

### Autorisation
- Vérification du rôle (famille vs association)
- Vérification ownership (association ne modifie que ses animaux)
- Middleware d'authentification centralisé

### Validation
- Validation données backend (express-validator)
- Hash Argon2 avec sel unique par utilisateur
- Prévention injections SQL (Sequelize ORM)

## Codes HTTP Utilisés

| Code | Signification | Utilisation |
|------|---------------|-------------|
| 200 | OK | Succès (GET, PATCH, DELETE) |
| 201 | Created | Ressource créée (POST) |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Authentifié mais non autorisé (rôle/ownership) |
| 404 | Not Found | Ressource introuvable |
