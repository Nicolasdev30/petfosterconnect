/**
 * MIDDLEWARES DE VALIDATION DES DONNÉES
 * 
 * Valide et sécurise toutes les entrées utilisateur avec express-validator :
 * 
 * Validations d'authentification :
 * - validateRegister : Inscription (email, mot de passe fort, noms)
 * - validateLogin : Connexion (email valide, mot de passe requis)
 * - validateSwitchRole : Changement de rôle (foster ↔ association)
 * 
 * Validations métier :
 * - validateAnimal : Création/modification d'animaux
 * - validateRequest : Demandes d'accueil
 * - validateAssociation : Gestion des associations
 * 
 * Sécurité OWASP :
 * - Sanitisation automatique (trim, normalizeEmail)
 * - Validation des formats (email, téléphone français)
 * - Limitation des longueurs de champs
 * - Whitelist des valeurs autorisées (statuts, rôles)
 */
import { body, validationResult } from "express-validator";

// Gérer les erreurs de validation
/**
 * Ce middleware vérifie si les données envoyées sont valides.
 * S'il y a des erreurs, il renvoie la liste des problèmes au client.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Données invalides",
      errors: errors.array(),
    });
  }
  next();
};

// Validation inscription
export const validateRegister = [
  body("first_name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Le prénom doit contenir entre 2 et 100 caractères"),
  body("last_name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères"),
  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Le mot de passe doit contenir une minuscule, une majuscule et un chiffre"
    ),
  handleValidationErrors,
];

// Validation connexion
export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Mot de passe requis"),
  handleValidationErrors,
];

// Validation changement de rôle
export const validateSwitchRole = [
  body("role")
    .isIn(["utilisateur", "association"])
    .withMessage("Le rôle doit être 'foster' ou 'association'"),
  handleValidationErrors,
];

// Validation création d'association
export const validateCreateAssociation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères"),
  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
  body("phone")
    .matches(/^0[1-9][0-9]{8}$/)
    .withMessage("Numéro de téléphone français invalide (format: 0123456789)"),
  body("address")
    .trim()
    .isLength({ min: 5 })
    .withMessage("L'adresse doit contenir au moins 5 caractères"),
  handleValidationErrors,
];

// Validation modification d'association (tous les champs optionnels)
export const validateUpdateAssociation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email invalide"),
  body("phone")
    .optional()
    .matches(/^0[1-9][0-9]{8}$/)
    .withMessage("Numéro de téléphone français invalide (format: 0123456789)"),
  body("address")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("L'adresse doit contenir au moins 5 caractères"),
  handleValidationErrors,
];

// Validation données d'animal (création)
export const validateAnimal = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Le nom doit contenir entre 1 et 100 caractères"),
  body("species")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("L'espèce ne peut pas dépasser 50 caractères"),
  body("breed")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("La race ne peut pas dépasser 100 caractères"),
  body("age")
    .optional()
    .isInt({ min: 0 })
    .withMessage("L'âge doit être un nombre entier positif"),
  body("sex")
    .optional()
    .isIn(["Mâle", "Femelle"])
    .withMessage("Le sexe doit être 'Mâle' ou 'Femelle'"),
  body("description").optional().trim(),
  body("photo_url").optional().isURL().withMessage("URL de photo invalide"),
  body("status")
    .optional()
    .isIn(["disponible", "accueilli"])
    .withMessage("Le statut doit être 'disponible' ou 'accueilli'"),
  handleValidationErrors,
];

// Validation données d'animal (modification - tous les champs optionnels)
export const validateUpdateAnimal = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Le nom doit contenir entre 1 et 100 caractères"),
  body("species")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("L'espèce ne peut pas dépasser 50 caractères"),
  body("breed")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("La race ne peut pas dépasser 100 caractères"),
  body("age")
    .optional()
    .isInt({ min: 0 })
    .withMessage("L'âge doit être un nombre entier positif"),
  body("sex")
    .optional()
    .isIn(["Mâle", "Femelle"])
    .withMessage("Le sexe doit être 'Mâle' ou 'Femelle'"),
  body("description").optional().trim(),
  body("photo_url").optional().isURL().withMessage("URL de photo invalide"),
  body("status")
    .optional()
    .isIn(["disponible", "accueilli"])
    .withMessage("Le statut doit être 'disponible' ou 'accueilli'"),
  handleValidationErrors,
];

// Validation demande d'accueil
export const validateRequest = [
  body("message")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Le message ne peut pas dépasser 1000 caractères"),
  body("id_animal").isInt({ min: 1 }).withMessage("ID animal invalide"),
  handleValidationErrors,
];

// Validation statut de demande
export const validateRequestStatus = [
  body("status")
    .isIn(["pending", "accepted", "refused"])
    .withMessage("Le statut doit être 'pending', 'accepted' ou 'refused'"),
  handleValidationErrors,
];

/**
 * Ces fonctions vérifient que les données envoyées par l'utilisateur sont correctes.
 * Chaque fonction correspond à une action (inscription, connexion, etc.)
 * et liste les règles que les données doivent respecter.
 */
