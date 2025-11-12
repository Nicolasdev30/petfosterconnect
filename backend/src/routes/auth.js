/**
 * ROUTES D'AUTHENTIFICATION
 * 
 * Gère toutes les routes liées à l'authentification :
 * 
 * Routes publiques :
 * - POST /register : Inscription (rôle "utilisateur" par défaut)
 * - POST /login : Connexion avec génération de cookie JWT
 * 
 * Routes protégées (token requis) :
 * - POST /logout : Déconnexion avec suppression de cookie
 * - GET /me : Récupération de l'utilisateur depuis le token
 * - PATCH /update : Mise à jour des informations personnelles
 * - GET /profile : Profil complet avec toutes les relations
 * - POST /switch-role : Basculement famille ↔ association
 * 
 * Sécurité :
 * - Validation stricte avec express-validator
 * - Middleware d'authentification sur routes protégées
 * - Gestion d'erreurs spécifiques (401, 403, 400)
 * 
 * Workflow typique :
 * 1. Inscription → rôle "utilisateur"
 * 2. Connexion → cookie JWT 7 jours
 * 3. Utilisation → token vérifié à chaque requête
 * 4. Switch role → si rattaché à association
 */
import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  switchRole,
  apiMe,
  update,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/auth.js";
import {
  validateRegister,
  validateLogin,
  validateSwitchRole,
} from "../middlewares/validation.js";

const router = express.Router();

// GET /api/auth - Information sur les routes d'authentification
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Endpoints d'authentification disponibles",
    endpoints: {
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      logout: "POST /api/auth/logout",
      profile: "GET /api/auth/profile",
      switchRole: "POST /api/auth/switch-role",
    },
    note: "Les routes d'associations ont été déplacées vers /api/associations",
  });
});

// POST /api/auth/register - Inscription (par défaut famille)
router.post("/register", validateRegister, register);

// POST /api/auth/login - Connexion
router.post("/login", validateLogin, login);

// POST /api/auth/logout - Déconnexion (invalidation côté client)
router.post("/logout", authenticateToken, logout);

// GET /api/auth/api/me - Récupérer l'utilisateur à partir du token
router.get("/me", authenticateToken, apiMe);

// UPDATE /api/auth/update - Met à jour les informations de l'utilisateur
router.patch("/update", authenticateToken, update);

// GET /api/auth/profile - Récupérer le profil complet
router.get("/profile", authenticateToken, getProfile);

// POST /api/auth/switch-role - Changer de rôle entre famille et association
router.post("/switch-role", authenticateToken, validateSwitchRole, switchRole);

export default router;
