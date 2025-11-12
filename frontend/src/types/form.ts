/**
 * TYPES TYPESCRIPT POUR LES FORMULAIRES
 *
 * Définitions des structures de données pour tous les formulaires :
 *
 * Formulaires d'authentification :
 * - UserRegisterForm : Inscription avec confirmation mot de passe
 * - UserLoginForm : Connexion (sans confirmation)
 *
 * Formulaires de gestion :
 * - UserUpdateForm : Mise à jour profil utilisateur
 * - RoleSwitchForm : Changement de rôle famille ↔ association
 *
 * Formulaires métier :
 * - AnimalForm : Création d'animaux par les associations
 * - AssociationForm : Création d'associations
 * - AssociationUpdateForm : Modification d'associations
 *
 * Avantages :
 * - Validation TypeScript à la compilation
 * - Réutilisabilité entre composants
 * - Cohérence des structures de données
 */

/**
 * TYPE : Formulaire d'inscription utilisateur
 * Inclut la confirmation de mot de passe pour validation
 */
export type UserRegisterForm = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/**
 * TYPE : Formulaire de connexion
 * Version simplifiée sans confirmation de mot de passe
 */
export type UserLoginForm = Omit<UserRegisterForm, "confirmPassword">;

/**
 * TYPE : Formulaire de mise à jour utilisateur
 * Tous les champs optionnels pour modification partielle
 */
export type UserUpdateForm = Partial<UserRegisterForm> & {
  id_user: string;
};

/**
 * TYPE : Formulaire de changement de rôle
 * Basculement entre famille d'accueil et gestionnaire d'association
 */
export type RoleSwitchForm = {
  role: string;
  id_user: string;
};

/**
 * TYPE : Formulaire de création d'animal
 * Toutes les informations nécessaires pour créer un animal
 */
export type AnimalForm = {
  name: string;
  species: string;
  breed: string;
  age: number;
  sex: string;
  description: string;
  photo_url: string;
  status?: string;
};

/**
 * TYPE : Formulaire de création d'association
 * Adresse décomposée pour faciliter la saisie
 */
export type AssociationForm = {
  name: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
};

/**
 * TYPE : Formulaire de mise à jour d'association
 * Modification partielle avec identifiants requis
 */
export type AssociationUpdateForm = Partial<AssociationForm> & {
  id_association: string;
  id_user: string;
};
