/**
 * ROUTES D'ADMINISTRATION SYSTÈME
 * 
 * Routes sensibles réservées aux administrateurs :
 * 
 * Middleware global :
 * - authenticateToken : Vérification JWT obligatoire
 * - requireRole("admin") : Accès admin uniquement
 * 
 * Actions disponibles :
 * - DELETE /users/:id : Suppression utilisateur (RGPD)
 * - DELETE /associations/:id : Suppression association
 * - DELETE /animals/:id : Suppression animal (modération)
 * 
 * Fonctionnalités de sécurité :
 * - Double vérification des permissions
 * - Logging complet pour audit
 * - Suppression en cascade intelligente
 * - Protection contre auto-suppression admin
 * 
 * Conformité RGPD :
 * - Droit à l'effacement (Art. 17)
 * - Suppression complète des données personnelles
 * - Traçabilité des actions administratives
 */
import express from "express";
import {
  deleteUser,
  deleteAnimalAdmin,
} from "../controllers/adminController.js";
import { deleteAssociation } from "../controllers/associationController.js";
import { authenticateToken, requireRole } from "../middlewares/auth.js";

const router = express.Router();

// Middleware global pour toutes les routes admin
router.use(authenticateToken);
router.use(requireRole("admin"));

// DELETE /api/admin/users/:id - Supprimer un utilisateur (conforme RGPD)
router.delete("/users/:id", deleteUser);

// DELETE /api/admin/associations/:id - Supprimer une association (action admin)
router.delete("/associations/:id", deleteAssociation);

// DELETE /api/admin/animals/:id - Supprimer un animal (action admin)
router.delete("/animals/:id", deleteAnimalAdmin);

export default router;
