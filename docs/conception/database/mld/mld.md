# MLD

@startuml
hide circle
title Modèle Logique de Données – Plateforme d'accueil animalier

class UTILISATEUR {
  +code_utilisateur : <<Primary_key>>
  nom
  prénom
  email
  mot_de_passe
  code_rôle : <<Foreign_key>>
}

class RÔLE {
  +code_rôle : <<Primary_key>>
  libellé_rôle
}

class ASSOCIATION {
  +code_association : <<Primary_key>>
  nom
  email
  adresse
  téléphone
}

class ANIMAL {
  +code_animal : <<Primary_key>>
  nom_animal
  espèce
  race
  âge
  description
  photo
  statut
  code_association : <<Foreign_key>>
}

class DEMANDE {
  +code_demande : <<Primary_key>>
  date_demande
  statut_demande
  code_utilisateur <<Foreign_key>>
}

' Relations :

UTILISATEUR "1" --- "0..*" RÔLE : DEFINIR
UTILISATEUR "0..1" --- "1..*" ASSOCIATION : PARTICIPER
ASSOCIATION "1" --- "0..*" ANIMAL : GERER
DEMANDE "1" --- "0..*" ANIMAL : CONCERNER
DEMANDE "1" --- "0..*" UTILISATEUR : EFFECTUER

@enduml
