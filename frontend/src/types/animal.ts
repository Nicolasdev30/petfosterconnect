/**
 * TYPES TYPESCRIPT POUR LES ANIMAUX
 * 
 * Définitions de types pour la gestion des animaux :
 * 
 * Animal (base) :
 * - Propriétés essentielles d'un animal
 * - Correspond au modèle Sequelize côté backend
 * 
 * AnimalExtended :
 * - Animal avec ses relations (association, demandes)
 * - Utilisé pour les pages de détails
 * 
 * Réponses API :
 * - AnimalsResponse : Liste d'animaux
 * - AnimalResponse : Animal individuel
 * 
 * Avantages TypeScript :
 * - Type safety à la compilation
 * - Autocomplétion dans l'IDE
 * - Détection d'erreurs précoce
 * - Documentation vivante du code
 */

import type { DataResponse } from "./apiResponse";
import type { Association } from "./association";
import type { RequestExtended } from "./request";

/**
 * TYPE : Animal de base
 * Représente un animal avec ses propriétés essentielles
 */
export type Animal = {
  id_animal: string;
  name: string;
  species: string;
  breed: string;
  sex: string;
  age: number;
  description: string;
  photo_url: string;
  status: string;
  id_association: string;
};

/**
 * TYPE : Animal avec relations
 * Inclut l'association responsable et les demandes reçues
 */
export type AnimalExtended = Animal & {
  association: Association;
  requests: RequestExtended[];
};

/**
 * TYPE : Réponse API pour liste d'animaux
 * Format standardisé des réponses de l'API
 */
export type AnimalsResponse = DataResponse<{
  animals: Animal[];
}>;

/**
 * TYPE : Réponse API pour animal individuel
 * Utilisé pour les pages de détails
 */
export type AnimalResponse = DataResponse<{
  animal: AnimalExtended;
}>;
