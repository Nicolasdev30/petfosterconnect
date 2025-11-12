/**
 * TYPES TYPESCRIPT POUR LES ASSOCIATIONS
 * 
 * Définitions de types pour les associations de protection animale :
 * 
 * Association (base) :
 * - Informations essentielles d'une association
 * - Coordonnées de contact complètes
 * 
 * AssociationExtended :
 * - Association avec ses animaux gérés
 * - Utilisé pour les pages de détails
 * 
 * Réponses API :
 * - AssociationsResponse : Liste d'associations
 * - AssociationResponse : Association individuelle
 * 
 * Utilisation :
 * - Validation des données à la compilation
 * - Autocomplétion pour les développeurs
 * - Cohérence entre frontend et backend
 */

import type { AnimalExtended } from "./animal";
import type { DataResponse } from "./apiResponse";

/**
 * TYPE : Association de base
 * Représente une association avec ses informations de contact
 */
export type Association = {
  id_association: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo?: string;
};

/**
 * TYPE : Association avec relations
 * Inclut tous les animaux gérés par l'association
 */
export type AssociationExtended = Association & {
  animals: AnimalExtended[];
};

/**
 * TYPE : Réponse API pour liste d'associations
 * Format standardisé pour les endpoints de liste
 */
export type AssociationsResponse = DataResponse<{
  associations: Association[];
}>;

/**
 * TYPE : Réponse API pour association individuelle
 * Utilisé pour les pages de détails avec animaux
 */
export type AssociationResponse = DataResponse<{
  association: AssociationExtended;
}>;
