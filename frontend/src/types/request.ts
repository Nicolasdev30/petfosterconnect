/**
 * TYPES TYPESCRIPT POUR LES DEMANDES D'ACCUEIL
 * 
 * Gestion du workflow des demandes d'adoption :
 * 
 * Request (base) :
 * - Informations essentielles d'une demande
 * - Statut du workflow (pending, accepted, refused)
 * 
 * RequestExtended :
 * - Request avec relations complètes
 * - Inclut l'utilisateur demandeur et l'animal demandé
 * 
 * Réponses API :
 * - RequestResponse : Format standardisé
 * 
 * Workflow métier :
 * - Famille fait demande → statut "pending"
 * - Association évalue → "accepted" ou "refused"
 * - Si accepté → animal passe en "accueilli"
 */

import type { Animal } from "./animal";
import type { DataResponse } from "./apiResponse";
import type { User } from "./user";

/**
 * TYPE : Demande d'accueil de base
 * Représente une demande faite par une famille pour un animal
 */
export type Request = {
  id_request: string;
  id_user: string;
  id_animal: string;
  status: string;
  message: string;
};

/**
 * TYPE : Demande avec relations complètes
 * Inclut les informations de l'utilisateur et de l'animal
 */
export type RequestExtended = Request & {
  user: User;
  animal: Animal;
};

/**
 * TYPE : Réponse API pour demande
 * Format standardisé des réponses de l'API
 */
export type RequestResponse = DataResponse<{
  request: Request;
}>;
