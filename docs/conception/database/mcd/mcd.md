# MCD

DEFINIR, 11 UTILISATEUR, 0N RÔLE
RÔLE: code rôle, libellé rôle
:
:

UTILISATEUR: code utilisateur, nom, prénom, email, mot de passe
EFFECTUER, 0N [famille] UTILISATEUR, 11 DEMANDE
DEMANDE: code demande, date demande, statut demande
CONCERNER, 11 DEMANDE, 0N ANIMAL

PARTICIPER, 01 UTILISATEUR, 1N ASSOCIATION
ASSOCIATION: code association, nom, email, adresse, téléphone
GERER, 0N ASSOCIATION, 11 ANIMAL
ANIMAL: code animal, nom animal, espèce, race, âge, description, photo, statut
