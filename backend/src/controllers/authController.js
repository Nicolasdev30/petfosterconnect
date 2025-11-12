/**
 * CONTRÔLEURS D'AUTHENTIFICATION
 * 
 * Gère toute la logique métier de l'authentification :
 * 
 * register :
 * - Inscription avec rôle "utilisateur" par défaut
 * - Hashage sécurisé des mots de passe (Argon2)
 * - Vérification d'unicité des emails
 * - Génération automatique de token JWT
 * 
 * login :
 * - Vérification des credentials
 * - Comparaison sécurisée des mots de passe hashés
 * - Création de session avec cookie HttpOnly
 * - Chargement des relations (rôle, association, demandes)
 * 
 * switchRole :
 * - Basculement entre rôles famille/association
 * - Vérification des permissions (rattachement requis)
 * - Mise à jour du token avec nouveau rôle
 * 
 * Sécurité OWASP :
 * - A02 : Argon2 pour le hashage (résistant GPU)
 * - A01 : Contrôle d'accès par rôles
 * - A07 : Gestion sécurisée des sessions JWT
 */
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User, Role, Animal, Association, Request } from "../models/index.js";

/**
 * UTILITAIRE : Génération de token JWT
 * Crée un token d'authentification valide 7 jours
 */
const generateToken = (userId, roleId) => {
  return jwt.sign({ id: userId, role: roleId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token valide 7 jours
  });
};

/**
 * CONTRÔLEUR : Inscription d'un nouvel utilisateur
 * POST /api/auth/register
 * Body: { first_name, last_name, email, password }
 * Note: L'utilisateur peut créer ou rejoindre une association après inscription
 */
export const register = async (req, res, next) => {
  try {
    // 1. Récupérer les données de base (uniquement utilisateur)
    const { first_name, last_name, email, password } = req.body;

    // 2. Vérifier si l'email n'est pas déjà utilisé
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà",
      });
    }

    // 3. Récupérer le rôle "foster" par défaut (tous les utilisateurs commencent comme famille)
    const userRole = await Role.findOne({ where: { label: "utilisateur" } });
    if (!userRole) {
      return res.status(500).json({
        success: false,
        message: "Erreur de configuration des rôles",
      });
    }

    // 4. Sécuriser le mot de passe avec un hash
    const hashedPassword = await argon2.hash(password);

    // 5. Créer le nouvel utilisateur en base (sans association)
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      id_role: userRole.id_role,
      id_association: null, // Pas d'association à l'inscription
    });

    // 6. Creer un token authentification
    const token = generateToken(user.id_user, user.id_role);

    // 7. Récupérer l'utilisateur complet (avec rôle)
    const userWithRole = await User.findByPk(user.id_user, {
      include: [
        { model: Role, as: "role" },
        { model: Association, as: "association" },
      ],
      attributes: { exclude: ["password"] },
    });

    // 8. Renvoyer la réponse avec l'utilisateur et le token (avec cookie)
res
  .cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  .status(201)
  .json({
    success: true,
    message: "Inscription réussie",
    data: {
      user: userWithRole,
    },
  });
    
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Changer de rôle (pour utilisateurs rattachés à une association)
 * POST /api/auth/switch-role
 * Headers: Authorization: Bearer <token>
 * Body: { role }
 */
export const switchRole = async (req, res, next) => {
  try {
    const { role, id_user } = req.body;

    // 1. Vérifier que l'utilisateur est rattaché à une association
    const user = await User.findByPk(id_user);

    if (!user.id_association) {
      return res.status(400).json({
        success: false,
        message:
          "Vous devez être rattaché à une association pour changer de rôle",
      });
    }

    // 2. Vérifier que le rôle est valide
    const validRoles = ["utilisateur", "association"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Rôle invalide. Choisissez entre 'utilisateur' et 'association'",
      });
    }

    // 3. Récupérer le rôle en base
    const userRole = await Role.findOne({ where: { label: role } });
    if (!userRole) {
      return res.status(500).json({
        success: false,
        message: "Erreur de configuration des rôles",
      });
    }

    // 4. Mettre à jour le rôle de l'utilisateur
    await user.update({ id_role: userRole.id_role });

    // 5. Récupérer l'utilisateur mis à jour
    const updatedUser = await User.findByPk(id_user, {
  include: [
    { model: Role, as: "role" },
    {
      model: Association,
      as: "association",
      include: [
        {
          model: Animal,
          as: "animals",
          include: [
            { 
              model: Request, 
              as: "requests",
              include: [
                { model: Animal, as: "animal" } // <-- manquait ici
              ]
            }
          ]
        },
      ],
    },
    {
      model: Request,
      as: "requests",
      include: [
        { model: Animal, as: "animal" },
      ],
    },
  ],
});

    // 6. Générer un nouveau token avec le nouveau rôle
    const token = generateToken(updatedUser.id_user, updatedUser.id_role);

    res
      .cookie("token", token, {
        httpOnly: true, // Prevents access via JavaScriptt (XSS protection)
        secure: process.env.NODE_ENV === "production", // HTTPS en production
        sameSite: "strict", // CRSF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
      })
      .json({
        success: true,
        message: `Rôle changé vers ${role} avec succès`,
        data: {
          user: updatedUser,
        },
      });
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Connexion d'un utilisateur existant
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = async (req, res, next) => {
  try {
    // 1. Récupérer les identifiants
    const { email, password } = req.body;

    // 2. Chercher l'utilisateur par email avec ses relations
    const user = await User.findOne({
      where: { email },
      include: [
        { model: Role, as: "role" },
        { model: Association, as: "association" },
        { model: Request, as: "requests" },
      ],
    });

    // 3. Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // 4. Vérifier que le mot de passe est correct
    // argon2.verify compare le mot de passe en clair avec le hash
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // 5. Créer un token d'authentification
    const token = generateToken(user.id_user, user.id_role);

    // 6. Supprimer le mot de passe de l'objet utilisateur avant envoi
    // on convertit l'objet en JSON puis on supprime le champ password
    const userWithoutPassword = user.toJSON();
    userWithoutPassword.password = "********";

    // 7. Renvoyer la réponse avec l'utilisateur et le token
    res
      .cookie("token", token, {
        httpOnly: true, // Prevents access via JavaScriptt (XSS protection)
        secure: process.env.NODE_ENV === "production", // HTTPS en production
        sameSite: "strict", // CRSF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
      })
      .json({
        success: true,
        message: "Connexion réussie",
        data: {
          user: userWithoutPassword,
        },
      });
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Récupérer le profil de l'utilisateur connecté
 * GET /api/auth/profile
 * Headers: Authorization: Bearer <token>
 */
export const getProfile = async (req, res, next) => {
  try {
    const { id } = req.query;

    const user = await User.findByPk(id, {
  include: [
    { model: Role, as: "role" },
    {
      model: Association,
      as: "association",
      include: [
        {
          model: Animal,
          as: "animals",
          include: [
            { 
              model: Request, 
              as: "requests",
              include: [
                { model: Animal, as: "animal" } // <-- manquait ici
              ]
            }
          ]
        },
      ],
    },
    {
      model: Request,
      as: "requests",
      include: [
        { model: Animal, as: "animal" },
      ],
    },
  ],
});

    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    if (user.association && user.association.animals && user.association.animals.length > 0) {
  console.log(user.association.animals[0].requests);
    }
   

    const userWithoutPassword = user.toJSON();
    userWithoutPassword.password = "********";

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const apiMe = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Non autorisé" 
    });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id, {
      include: [
        { model: Role, as: "role" },
        {
          model: Association,
          as: "association",
          include: [
            {
              model: Animal,
              as: "animals",
              include: [
                { 
                  model: Request, 
                  as: "requests",
                  include: [
                    { 
                      model: User, 
                      as: "user",
                      attributes: ["id_user", "first_name", "last_name", "email"]
                    }
                  ]
                }
              ]
            },
          ],
        },
        {
          model: Request,
          as: "requests",
          include: [
            { 
              model: Animal, 
              as: "animal",
              attributes: ["id_animal", "name", "species", "breed", "photo_url", "status"]
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Utilisateur introuvable" 
      });
    }

    const userWithoutPassword = user.toJSON();
    userWithoutPassword.password = "********";

    res.json({
      success: true,
      message: "Utilisateur trouvé",
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false,
        message: "Token invalide" 
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Token expiré" 
      });
    }
    console.error("Erreur dans apiMe:", error);
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id_user, first_name, last_name, email, password, id_association } =
      req.body;

    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    switch (true) {
      case Boolean(email):
        await user.update({ email });
        break;

      case Boolean(first_name):
        await user.update({ first_name });
        break;

      case Boolean(last_name):
        await user.update({ last_name });
        break;

      case Boolean(password):
        await user.update({ password });
        break;

      case Boolean(id_association):
        await user.update({ id_association });
        break;

      default:
        return res
          .status(400)
          .json({ message: "Aucune donnée valide à mettre à jour" });
    }

    const updatedUser = await User.findByPk(id_user, {
      include: [
        { model: Role, as: "role" },
        { model: Association, as: "association" },
        // { model: Request, as: "requests" },
      ],
    });

    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    const userWithoutPassword = updatedUser.toJSON();
    userWithoutPassword.password = "********";

    res.json({
      success: true,
      message: "Utilisateur trouvé",
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Déconnexion (côté client)
 * POST /api/auth/logout
 * Note: Avec JWT, la déconnexion se fait côté client en supprimant le token
 */
export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  }).json({
    success: true,
    message: "Déconnexion réussie",
  });
};
