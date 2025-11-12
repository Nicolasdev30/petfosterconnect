/**
 * ROUTES DE GESTION DES DEMANDES D'ACCUEIL
 * 
 * Workflow complet des demandes d'adoption :
 * 
 * Routes famille d'accueil :
 * - POST / : Créer une demande (rôle "utilisateur" requis)
 * - GET /user : Voir ses propres demandes avec filtres
 * 
 * Routes association :
 * - GET /received : Demandes reçues pour ses animaux
 * - PATCH /:id : Accepter/refuser une demande
 * 
 * Route mixte :
 * - GET /:id : Détails (propriétaire OU association)
 * 
 * Logique métier implémentée :
 * - Vérification animal disponible avant création
 * - Évitement des doublons (une demande par user/animal)
 * - Changement de statut animal lors d'acceptation
 * - Contrôle de propriété strict pour modifications
 * 
 * Statuts gérés :
 * - "pending" : En attente (défaut)
 * - "accepted" : Acceptée → animal devient "accueilli"
 * - "refused" : Refusée → animal reste "disponible"
 */
import express from "express";
import {
  createRequest,
  getUserRequests,
  getReceivedRequests,
  getRequestById,
  updateRequestStatus,
} from "../controllers/requestController.js";
import { authenticateToken, requireRole } from "../middlewares/auth.js";
import {
  validateRequest,
  validateRequestStatus,
} from "../middlewares/validation.js";

const router = express.Router();

// POST /api/requests - Créer une demande d'accueil (famille uniquement)
router.post(
  "/",
  authenticateToken,
  requireRole("utilisateur"),
  validateRequest,
  createRequest
);

// GET /api/requests/user - Mes demandes d'adoption (famille uniquement)
router.get("/user", authenticateToken, requireRole("utilisateur"), getUserRequests);

// GET /api/requests/received - Demandes reçues (association uniquement)
router.get(
  "/received",
  authenticateToken,
  requireRole("association"),
  getReceivedRequests
);

// GET /api/requests/:id - Détails d'une demande (propriétaire ou association)
router.get("/:id", authenticateToken, getRequestById);

// PATCH /api/requests/:id - Modifier le statut d'une demande (association uniquement)
router.patch(
  "/:id",
  authenticateToken,
  requireRole("association"),
  validateRequestStatus,
  updateRequestStatus
);

export default router;
