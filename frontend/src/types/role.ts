export type Role = {
  id_role: number;
  label: string;
};
/**
 * TYPES TYPESCRIPT POUR LES RÔLES UTILISATEUR
 * 
 * Gestion du système de rôles de l'application :
 * 
 * Role :
 * - Structure simple avec ID et label
 * - Correspond au modèle Sequelize côté backend
 * 
 * Rôles disponibles :
 * - "utilisateur" : Famille d'accueil (peut faire des demandes)
 * - "association" : Gestionnaire (peut gérer animaux et demandes)
 * - "admin" : Administrateur système (accès complet)
 * 
 * Utilisation :
 * - Contrôle d'accès dans les composants
 * - Affichage conditionnel des fonctionnalités
 * - Validation des permissions côté frontend
 */


/**
 * TYPE : Rôle utilisateur
 * Définit les permissions et accès dans l'application
 */