/**
 * MIDDLEWARES DE GESTION D'ERREURS
 * 
 * Gestion centralisée des erreurs de l'API :
 * 
 * notFound :
 * - Capture toutes les routes inexistantes (404)
 * - Crée une erreur standardisée pour le gestionnaire principal
 * 
 * errorHandler :
 * - Gestionnaire global de toutes les erreurs de l'application
 * - Logs pour le debugging en développement
 * - Réponses JSON standardisées pour le frontend
 * - Masquage des détails techniques en production
 * 
 * Avantages :
 * - Format de réponse cohérent
 * - Logging centralisé pour le monitoring
 * - Sécurité (pas de fuite d'informations sensibles)
 */
// Page non trouvée
/**
 * Ce middleware capture toutes les routes qui n'existent pas dans l'application.
 * Quand un utilisateur va sur une URL qui n'existe pas (ex: /api/inexistant),
 * ce middleware crée une erreur 404 et la passe au gestionnaire d'erreurs principal.
 */
export const notFound = (req, res, next) => {
  const error = new Error("Page non trouvée");
  res.status(404);
  next(error);
};

// Gestion des erreurs
/**
 * Ce middleware gère toutes les erreurs de l'application.
 * Il affiche l'erreur dans la console pour les développeurs,
 * puis renvoie une réponse JSON avec le message d'erreur au client.
 * Toutes les erreurs sont traitées comme des erreurs serveur (500) par simplicité.
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Erreur :", err.message);

  res.status(500).json({
    message: err.message,
  });
};
