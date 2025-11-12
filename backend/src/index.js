/**
 * POINT D'ENTRÉE PRINCIPAL DU SERVEUR EXPRESS
 * 
 * Configuration complète du serveur API :
 * 
 * Middlewares de sécurité :
 * - Helmet : Protection des headers HTTP
 * - CORS : Contrôle d'accès cross-origin
 * - Express.json : Parsing des requêtes JSON
 * 
 * Documentation :
 * - Swagger UI : Interface interactive pour tester l'API
 * - Configuration personnalisée avec CSS
 * 
 * Gestion d'erreurs :
 * - Middleware global de gestion d'erreurs
 * - Routes 404 pour endpoints inexistants
 * 
 * Démarrage :
 * - Test de connexion base de données
 * - Synchronisation des modèles Sequelize
 * - Démarrage du serveur sur le port configuré
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { testConnection } from "./config/database.js";
import { syncDatabase } from "./models/index.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { specs, swaggerUi } from "./config/swagger.js";
import routes from './routes/index.js';

// Configuration des variables d'environnement
dotenv.config();

/**
 * VÉRIFICATION DE SÉCURITÉ : JWT_SECRET
 * Alerte si le secret par défaut est utilisé (risque de sécurité)
 */
// Vérification du JWT_SECRET (évite d'oublier de le changer)
if (
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET === "your-super-secret-jwt-key-change-in-production"
) {
  console.warn(
    "⚠️ ATTENTION: JWT_SECRET par défaut détecté. Changez-le avant de déployer !"
  );
}

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * MIDDLEWARES DE SÉCURITÉ
 * Configuration des protections automatiques
 */
// Sécurité automatique avec helmet (ajoute des headers pour protéger contre les attaques web)
app.use(helmet());

/**
 * CONFIGURATION CORS
 * Autorise uniquement le frontend configuré pour éviter les attaques cross-origin
 */
// Middlewares globaux
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Autorise seulement notre frontend
    credentials: true, // Permet d'envoyer des cookies/tokens
  })
);

/**
 * MIDDLEWARES DE PARSING
 * Configuration pour traiter les requêtes HTTP
 */
// Module nécessaire à la lecture des cookies
app.use(cookieParser());
// Limite la taille des requêtes (évite les attaques par gros fichiers)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * DOCUMENTATION SWAGGER
 * Interface interactive pour tester l'API
 */
// Documentation Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customSiteTitle: "Pet Foster Connect API",
    customCss: `
    .swagger-ui .topbar { 
      background-color: #3bb188ff; 
    }
    .swagger-ui .topbar .download-url-wrapper .select-label {
      color: white;
    }
  `,
  })
);

/**
 * ROUTE D'ACCUEIL DE L'API
 * Présentation générale avec tous les endpoints disponibles
 */
// Route de base
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🐾 Bienvenue sur l'API Pet Foster Connect",
    version: "1.0.0",
    documentation: "/api-docs",
    api: "/api",
    endpoints: {
      auth: "/api/auth",
      animals: "/api/animals",
      associations: "/api/associations",
      requests: "/api/requests",
      admin: "/api/admin",
      health: "/api/health",
    },
  });
});
app.use('/api', routes);
/**
 * ROUTES PRINCIPALES
 * Délégation vers les routeurs spécialisés
 */
// Middleware de gestion des erreurs (doit être en dernier)
/**
 * MIDDLEWARES DE GESTION D'ERREURS
 * Doivent être en dernier pour capturer toutes les erreurs
 */
app.use(notFound);
app.use(errorHandler);

/**
 * FONCTION DE DÉMARRAGE DU SERVEUR
 * Séquence d'initialisation complète avec gestion d'erreurs
 */
// Démarrage du serveur
const startServer = async () => {
  try {
    // Test de la connexion à la base de données
    await testConnection();

    // Synchronisation des modèles
    await syncDatabase();

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📡 API accessible sur http://localhost:${PORT}/api`);
      console.log(`� Documentation Swagger: http://localhost:${PORT}/api-docs`);
      console.log(`�🔍 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Erreur lors du démarrage du serveur:", error);
    process.exit(1);
  }
};

// Lancement de l'application
startServer();
