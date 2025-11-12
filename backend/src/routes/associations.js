/**
 * ROUTES DE GESTION DES ASSOCIATIONS
 * 
 * API RESTful pour les associations de protection animale :
 * 
 * Routes publiques :
 * - GET / : Liste avec recherche et pagination
 * - GET /names : Noms d'associations pour filtres
 * - GET /cities : Villes d'associations pour filtres
 * - GET /:id : Détails avec animaux gérés
 * 
 * Routes protégées :
 * - POST /create : Création avec rattachement automatique
 * - PATCH /:id : Modification (membres uniquement)
 * - DELETE /:id : Suppression (admin uniquement)
 * 
 * Fonctionnalités métier :
 * - Recherche par nom et ville
 * - Création avec devenir gestionnaire automatique
 * - Modification des informations de contact
 * - Suppression en cascade (animaux, demandes)
 * 
 * Middlewares de sécurité :
 * - Validation des données (email unique, format téléphone)
 * - Contrôle d'accès par rôle
 * - Vérification de propriété pour modifications
 */
import express from "express";
import {
  getAllAssociations,
  getAssociationById,
  getAssociationNames,
  getAssociationCities,
  updateAssociation,
  deleteAssociation,
  createAssociation,
} from "../controllers/associationController.js";
import { authenticateToken, requireRole } from "../middlewares/auth.js";
import {
  validateCreateAssociation,
  validateUpdateAssociation,
} from "../middlewares/validation.js";

const router = express.Router();

// GET /api/associations - Liste des associations avec recherche
router.get("/", getAllAssociations);

// GET /api/associations/names - Liste des noms d'associations disponibles
router.get("/names", getAssociationNames);

// GET /api/associations/cities - Liste des villes d'associations disponibles
router.get("/cities", getAssociationCities);

// GET /api/associations/:id - Détails d'une association avec ses animaux
router.get("/:id", getAssociationById);

// POST /api/associations/create - Créer une association et s'y rattacher
router.post(
  "/create",
  authenticateToken,
  validateCreateAssociation,
  createAssociation
);

// PATCH /api/associations/:id - Modifier une association (membres uniquement)
router.patch(
  "/:id",
  authenticateToken,
  requireRole("association"),
  validateUpdateAssociation,
  updateAssociation
);

// DELETE /api/associations/:id - Supprimer une association (admin uniquement)
router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  deleteAssociation
);

export default router;
