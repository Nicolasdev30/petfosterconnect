# Activity diagram

@startuml
title Diagramme de séquence - Interactions utilisateur

actor Utilisateur
participant "Frontend React" as Frontend
participant "API Node.js" as Backend
database "PostgreSQL" as DB

== Création de compte ==
Utilisateur -> Frontend : Remplit formulaire d'inscription  
Frontend -> Backend : POST /auth/register (données + rôle)  
Backend -> DB : INSERT INTO users  
DB --> Backend : OK  
Backend --> Frontend : 201 Created  
Frontend --> Utilisateur : Confirmation d'inscription

== Connexion ==
Utilisateur -> Frontend : Saisit identifiants  
Frontend -> Backend : POST /auth/login  
Backend -> DB : SELECT user + vérification mdp  
DB --> Backend : Données utilisateur  
Backend --> Frontend : JWT (token)  
Frontend --> Utilisateur : Redirection tableau de bord

== Affichage des animaux ==
Utilisateur -> Frontend : Clique sur "Voir les animaux"  
Frontend -> Backend : GET /api/animals  
Backend -> DB : SELECT \* FROM animals WHERE disponible = true  
DB --> Backend : Liste animaux  
Backend --> Frontend : JSON animaux  
Frontend --> Utilisateur : Affiche la liste

== Famille d'accueil : Demande d'accueil ==
Utilisateur -> Frontend : Clique sur "Demander à accueillir"  
Frontend -> Backend : POST /api/request (animalId, userId)  
Backend -> DB : INSERT INTO requests  
DB --> Backend : OK  
Backend --> Frontend : Confirmation  
Frontend --> Utilisateur : Demande en attente de confirmation

@enduml
