/**
 * MIDDLEWARES D'AUTHENTIFICATION ET D'AUTORISATION
 * 
 * Sécurise l'accès aux routes de l'API :
 * 
 * authenticateToken :
 * - Vérifie la validité du token JWT dans les cookies
 * - Charge les informations utilisateur (rôle, association)
 * - Gère les erreurs spécifiques (token invalide, expiré)
 * 
 * requireRole :
 * - Contrôle d'accès basé sur les rôles (RBAC)
 * - Autorise seulement les rôles spécifiés
 * 
 * requireAssociation :
 * - Vérifie l'appartenance à une association
 * - Utilisé pour les actions réservées aux gestionnaires
 */
import jwt from "jsonwebtoken";
import { User, Role, Association } from "../models/index.js";

// Vérifier le token JWT
/**
 * Ce middleware vérifie que l'utilisateur a le bon token JWT.
 * Il récupère les infos de l'utilisateur et les met dans req.user
 * pour que les autres fonctions puissent les utiliser.
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token; // ✅ cookie HttpOnly

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Non autorisé" 
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur avec ses infos
    const user = await User.findByPk(decoded.id, {
      include: [
        { model: Role, as: "role" },
        { model: Association, as: "association" },
      ],
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Non autorisé" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false,
        message: "Non autorisé" 
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Session expirée" 
      });
    }
    return res.status(401).json({ 
      success: false,
      message: "Non autorisé" 
    });
  }
};

// Vérifier les rôles autorisés
/**
 * Ce middleware vérifie que l'utilisateur a le bon rôle.
 * Exemple : requireRole('admin', 'moderator') autorise seulement
 * les admins et modérateurs à accéder à la route.
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    const userRole = req.user.role.label;
    console.log("🔍 requireRole - User role:", userRole);
    console.log("🔍 requireRole - Allowed roles:", allowedRoles);
    console.log("🔍 requireRole - Check result:", allowedRoles.includes(userRole));

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Permissions insuffisantes" });
    }

    next();
  };
};

// Vérifier qu'on appartient à une association
/**
 * Ce middleware vérifie que l'utilisateur fait partie d'une association.
 * Utile pour les routes où seuls les membres d'associations peuvent agir.
 */
export const requireAssociation = (req, res, next) => {
  if (!req.user.id_association) {
    return res.status(403).json({ message: "Association requise" });
  }
  next();
};
