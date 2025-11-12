/**
 * ROUTES DE GESTION DES ANIMAUX
 * 
 * API RESTful pour la gestion des animaux :
 * 
 * Routes publiques :
 * - GET / : Liste paginée avec filtres avancés
 * - GET /species : Espèces disponibles pour filtres
 * - GET /:id : Détails d'un animal spécifique
 * 
 * Routes protégées (association uniquement) :
 * - POST / : Création d'un nouvel animal
 * - PATCH /:id : Modification (propriétaire uniquement)
 * 
 * Middlewares appliqués :
 * - authenticateToken : Vérification JWT sur routes protégées
 * - requireRole("association") : Contrôle d'accès par rôle
 * - validateAnimal : Validation des données avec express-validator
 * 
 * Filtres supportés :
 * - species : Filtrage par espèce
 * - breed : Filtrage par race
 * - age : Filtrage par tranches d'âge
 * - status : Filtrage par statut (disponible/accueilli)
 * - association : Filtrage par nom d'association
 * 
 * Sécurité :
 * - Validation stricte des entrées
 * - Vérification de propriété pour modifications
 * - Sanitisation automatique des données
 */
import express from "express";
import {
  getAllAnimals,
  getAnimalById,
  createAnimal,
  deleteAnimal,
  updateAnimal,
  getSpecies,
} from "../controllers/animalController.js";
import { authenticateToken, requireRole } from "../middlewares/auth.js";
import {
  validateAnimal,
  validateUpdateAnimal,
} from "../middlewares/validation.js";

const router = express.Router();

// GET /api/animals - Liste des animaux
router.get("/", getAllAnimals);

// GET /api/animals/species - Liste des espèces disponibles
router.get("/species", getSpecies);

// GET /api/animals/:id - Détails d'un animal
router.get("/:id", getAnimalById);

// POST /api/animals - Créer un animal (association uniquement)
router.post(
  "/",
  authenticateToken,
  requireRole("association"),
  validateAnimal,
  createAnimal
);

// PATCH /api/animals/:id - Modifier un animal (association propriétaire)
router.patch(
  "/:id",
  authenticateToken,
  requireRole("association"),
  validateUpdateAnimal,
  updateAnimal
);

// DELETE /api/animals/:id - Supprimer un animal (association propriétaire)
router.delete(
  "/:id",
  authenticateToken,
  requireRole("association"),
  deleteAnimal
);

export default router;
