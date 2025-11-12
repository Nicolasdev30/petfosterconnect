/**
 * ROUTEUR PRINCIPAL DE L'API
 * 
 * Point d'entrée de toutes les routes API :
 * 
 * Routes d'information :
 * - GET /api : Présentation de l'API et endpoints disponibles
 * - GET /api/health : Health check pour monitoring
 * 
 * Routes métier organisées par domaine :
 * - /api/auth : Authentification et gestion utilisateurs
 * - /api/animals : Gestion des animaux (CRUD complet)
 * - /api/associations : Gestion des associations
 * - /api/requests : Workflow des demandes d'accueil
 * - /api/admin : Actions administratives sensibles
 * 
 * Architecture RESTful :
 * - Verbes HTTP appropriés (GET, POST, PATCH, DELETE)
 * - Codes de statut standardisés
 * - Réponses JSON cohérentes
 * - Documentation Swagger intégrée
 */
import express from "express";
import authRoutes from "./auth.js";
import animalRoutes from "./animals.js";
import associationRoutes from "./associations.js";
import requestRoutes from "./requests.js";
import adminRoutes from "./admin.js";

const router = express.Router();

// Route d'accueil de l'API
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🐾 Bienvenue sur l'API Pet Foster Connect",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      animals: "/api/animals",
      associations: "/api/associations",
      requests: "/api/requests",
      admin: "/api/admin",
    },
    description:
      "API RESTful pour la plateforme de mise en relation entre familles d'accueil et associations de protection animale",
  });
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API Pet Foster Connect fonctionne correctement",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Routes par domaine
router.use("/auth", authRoutes);
router.use("/animals", animalRoutes);
router.use("/associations", associationRoutes);
router.use("/requests", requestRoutes);
router.use("/admin", adminRoutes);

export default router;
