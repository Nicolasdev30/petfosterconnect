/**
 * TYPES TYPESCRIPT POUR LES UTILISATEURS
 * 
 * Hiérarchie des types utilisateur :
 * 
 * User (base) :
 * - Informations personnelles minimales
 * - Utilisé pour les affichages publics
 * 
 * AuthUser :
 * - User avec mot de passe pour l'authentification
 * - Utilisé lors de la connexion
 * 
 * UserExtended :
 * - User avec toutes les relations (rôle, association, demandes)
 * - Utilisé pour les profils complets
 * 
 * Réponses API :
 * - UserResponse : Format standardisé des réponses
 * 
 * Sécurité :
 * - Séparation des types selon le contexte
 * - Mot de passe isolé dans AuthUser uniquement
 */

import type { DataResponse } from "./apiResponse";
import type { AssociationExtended } from "./association";
import type { RequestExtended } from "./request";
import type { Role } from "./role";

/**
 * TYPE : Utilisateur de base
 * Informations personnelles essentielles
 */
export type User = {
  id_user: string;
  first_name: string;
  last_name: string;
  email: string;
};

/**
 * TYPE : Utilisateur avec mot de passe
 * Utilisé pour l'authentification uniquement
 */
export type AuthUser = UserExtended & {
  password: string;
};

/**
 * TYPE : Utilisateur avec toutes les relations
 * Profil complet avec rôle, association et historique
 */
export type UserExtended = User & {
  id_role: string;
  id_association?: string | null;
  role: Role;
  association?: AssociationExtended | null;
  requests: RequestExtended[];
};

/**
 * TYPE : Réponse API pour utilisateur
 * Format standardisé des réponses d'authentification
 */
export type UserResponse = DataResponse<{
  user: AuthUser;
}>;
