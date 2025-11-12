/**
 * TYPES TYPESCRIPT POUR LES RÉPONSES API
 *
 * Standardisation des formats de réponse :
 *
 * DataResponse<T> :
 * - Format générique pour toutes les réponses avec données
 * - Structure cohérente : success, message, data
 * - Type générique T pour les données spécifiques
 *
 * LogoutResponse :
 * - Format spécifique pour la déconnexion
 * - Pas de données, juste confirmation
 *
 * Avantages :
 * - Cohérence des réponses API
 * - Type safety pour les données
 * - Gestion d'erreurs standardisée
 * - Documentation automatique des formats
 */

/**
 * TYPE : Réponse API générique avec données
 * Format standardisé pour toutes les réponses contenant des données
 */
export type DataResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

/**
 * TYPE : Réponse de déconnexion
 * Format spécifique pour les actions sans données de retour
 */
export type LogoutResponse = {
  success: boolean;
  message: string;
};
