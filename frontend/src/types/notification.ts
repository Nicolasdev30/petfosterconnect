/**
 * TYPES TYPESCRIPT POUR LE SYSTÈME DE NOTIFICATIONS
 *
 * Gestion des notifications toast de l'application :
 *
 * NotificationType :
 * - Types de notifications disponibles
 * - Chaque type a sa couleur et son icône
 *
 * Notification :
 * - Structure complète d'une notification
 * - ID unique pour la gestion
 * - Durée configurable pour auto-suppression
 *
 * Utilisation :
 * - Feedback utilisateur pour les actions
 * - Gestion d'erreurs user-friendly
 * - Confirmations d'opérations réussies
 *
 * Types supportés :
 * - success : Confirmations (vert)
 * - error : Erreurs (rouge)
 * - warning : Avertissements (orange)
 * - info : Informations (bleu)
 */

/**
 * TYPE : Types de notifications disponibles
 * Détermine la couleur et l'icône affichées
 */
export type NotificationType = "success" | "error" | "warning" | "info";

/**
 * INTERFACE : Structure d'une notification
 * Contient toutes les informations nécessaires à l'affichage
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // en millisecondes, par défaut 5000ms
}
