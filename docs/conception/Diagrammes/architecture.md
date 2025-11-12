# Architecture diagram

@startuml
title Architecture Dockerisée - Application Web

' Représente l'utilisateur et son navigateur
node "Utilisateur" {
  [Navigateur Web]
}

' Environnement Docker
node "Docker (Environnement conteneurisé)" {

  ' NGINX
  node "Serveur NGINX (Reverse Proxy)" {
    component "NGINX" as nginx
  }

  ' Frontend
  node "Frontend" {
    component "React SPA\n(port 3000)" as frontend
  }

  ' Backend
  node "Backend" {
    component "API REST Node.js\n(port 5000)" as backend
  }

  ' Base de données
  database "PostgreSQL\n(port 5432)" as db
}

' Connexions
[Navigateur Web] --> nginx : Requêtes HTTP
nginx --> frontend : Requêtes frontend (GET)
nginx --> backend : Requêtes API (POST, GET, etc.)
frontend --> backend : Appels API (fetch/Axios)
backend --> db : Requêtes SQL

@enduml
