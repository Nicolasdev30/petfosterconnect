/**
 * CONTRÔLEURS DE GESTION DES ASSOCIATIONS
 * 
 * Gère toutes les opérations sur les associations :
 * 
 * getAllAssociations :
 * - Liste paginée avec recherche par nom et ville
 * - Filtrage avec ILIKE (insensible à la casse)
 * - Tri alphabétique par nom
 * 
 * getAssociationById :
 * - Détails complets avec tous les animaux
 * - Accessible publiquement
 * - Relations Sequelize optimisées
 * 
 * createAssociation :
 * - Création avec rattachement automatique de l'utilisateur
 * - Vérification d'unicité (email, nom)
 * - Génération de nouveau token avec association
 * 
 * updateAssociation :
 * - Modification par les membres uniquement
 * - Validation des permissions stricte
 * - Mise à jour partielle des champs
 * 
 * deleteAssociation :
 * - Suppression en cascade (ADMIN uniquement)
 * - Supprime animaux, demandes, détache utilisateurs
 * - Logging de sécurité pour audit
 * 
 * Utilitaires :
 * - getAssociationNames : Pour les filtres de recherche
 * - getAssociationCities : Extraction intelligente des villes
 */
import { Association, Animal, User, Role, Request } from "../models/index.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

/**
 * UTILITAIRE : Génération de token JWT
 * Crée un token d'authentification valide 7 jours
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token valide 7 jours
  });
};

/**
 * CONTRÔLEUR : Récupérer toutes les associations avec filtres optionnels
 * GET /api/associations
 * Query params: name, city, page, limit
 */
export const getAllAssociations = async (req, res, next) => {
  try {
    // 1. Récupérer les paramètres de requête avec valeurs par défaut
    const { page = 1, limit = 10, name, city } = req.query;

    // 2. Construire les conditions de filtrage dynamiques
    const where = {};

    if (name) {
      where.name = {
        [Op.iLike]: `%${name}%`,
      };
    }

    if (city) {
      where.address = {
        [Op.iLike]: `%${city}%`,
      };
    }

    // 3. Récupérer les associations avec filtres
    const { count, rows } = await Association.findAndCountAll({
      where,
      attributes: ["id_association", "name", "email", "phone", "address"],
      order: [["name", "ASC"]],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    // 4. Retourner les données avec métadonnées de pagination
    res.json({
      success: true,
      data: {
        associations: rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Récupérer tous les noms d'associations disponibles
 * GET /api/associations/names
 */
export const getAssociationNames = async (req, res, next) => {
  try {
    const names = await Association.findAll({
      attributes: ["name"],
      where: {
        name: {
          [Op.not]: null,
          [Op.ne]: "",
        },
      },
      group: ["name"],
      order: [["name", "ASC"]],
    });

    const uniqueNames = names.map((association) => association.name);

    res.json({
      success: true,
      data: {
        names: uniqueNames,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Récupérer toutes les villes d'associations disponibles
 * GET /api/associations/cities
 */
export const getAssociationCities = async (req, res, next) => {
  try {
    const cities = await Association.findAll({
      attributes: ["address"],
      where: {
        address: {
          [Op.not]: null,
          [Op.ne]: "",
        },
      },
      group: ["address"],
      order: [["address", "ASC"]],
    });

    // Extraire uniquement le nom de la ville de l'adresse
    const uniqueCities = cities
      .map((association) => {
        const address = association.address;
        // Diviser l'adresse par les virgules
        const parts = address.split(",").map((part) => part.trim());

        // Chercher la partie qui contient la ville (généralement avant le code postal)
        for (let i = parts.length - 1; i >= 0; i--) {
          const part = parts[i];
          // Si la partie ne contient que des chiffres (code postal), passer à la suivante
          if (!/^\d+$/.test(part) && part.length > 1) {
            // Retirer les codes postaux qui peuvent être collés au nom de ville
            return part.replace(/\b\d{5}\b/g, "").trim();
          }
        }

        // Si aucune ville trouvée, retourner la dernière partie nettoyée
        return parts[parts.length - 1].replace(/\b\d{5}\b/g, "").trim();
      })
      .filter((city) => city && city.length > 1) // Filtrer les villes vides ou trop courtes
      .filter((city, index, self) => self.indexOf(city) === index); // Retirer les doublons

    res.json({
      success: true,
      data: {
        cities: uniqueCities.sort(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Récupérer une association par son ID avec ses animaux
 * GET /api/associations/:id
 * Params: id (ID de l'association)
 */
export const getAssociationById = async (req, res, next) => {
  try {
    // 1. Récupérer l'ID depuis les paramètres de route
    const { id } = req.params;

    // 2. Rechercher l'association avec ses animaux liés
    const association = await Association.findByPk(id, {
      attributes: ["id_association", "name", "email", "phone", "address"],
      include: [
        {
          model: Animal,
          as: "animals",
          attributes: [
            "id_animal",
            "name",
            "species",
            "breed",
            "age",
            "description",
            "photo_url",
            "status",
          ],
        },
      ],
    });

    // 3. Vérifier que l'association existe
    if (!association) {
      return res.status(404).json({
        success: false,
        message: "Association non trouvée",
      });
    }

    // 4. Retourner l'association avec ses animaux
    res.json({
      success: true,
      data: { association },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Modifier une association existante
 * PUT /api/associations/:id
 * Body: { name, email, phone, address }
 */
export const updateAssociation = async (req, res, next) => {
  try {
    // 1. Récupérer l'ID et les nouvelles données
    const { id } = req.params;
    const { id_user, name, email, phone, address } = req.body;

    // 2. Vérifier que l'association existe
    const association = await Association.findByPk(id);

    if (!association) {
      return res.status(404).json({
        success: false,
        message: "Association non trouvée",
      });
    }

    // 3. Vérifier que l'utilisateur appartient à cette association
    const user = await User.findByPk(id_user);

    if (user.id_association !== association.id_association) {
      return res.status(403).json({
        success: false,
        message: "Vous ne pouvez modifier que votre propre association",
      });
    }

    // 4. Vérifier l'unicité si modification du nom ou email
    if (name || email) {
      const allAssociations = await Association.findAll();
      const conditions = [];
      if (name && name !== association.name) {
        conditions.push({ name });
      }
      if (email && email !== association.email) {
        conditions.push({ email });
      }
      if (conditions.length > 0) {
        const existingAssociation = allAssociations.find((a) => {
          if (a.id_association === parseInt(id)) return false;
          return conditions.some(
            (cond) =>
              (cond.name && a.name === cond.name) ||
              (cond.email && a.email === cond.email)
          );
        });
        if (existingAssociation) {
          return res.status(400).json({
            success: false,
            message: "Une association avec ce nom ou cet email existe déjà",
          });
        }
      }
    }

    // 5. Mettre à jour l'association
    await association.update({
      name: name || association.name,
      email: email || association.email,
      phone: phone || association.phone,
      address: address || association.address,
    });

    const updatedUser = await User.findByPk(id_user, {
      include: [
        { model: Role, as: "role" },
        { model: Association, as: "association" },
        // { model: Request, as: "requests" },
      ],
    });

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const userWithoutPassword = updatedUser.toJSON();
    userWithoutPassword.password = "********";

    // 6. Retourner l'utilisateur avec l'association modifier
    res.json({
      success: true,
      message: "Association mise à jour avec succès",
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Supprimer une association (ADMIN)
 * DELETE /api/associations/:id
 * Params: id (ID de l'association à supprimer)
 * Suppression en cascade : animaux, demandes et utilisateurs liés
 */
export const deleteAssociation = async (req, res, next) => {
  try {
    // 1. Récupérer l'ID de l'association à supprimer
    const { id } = req.params;

    // 2. Vérifier que l'association existe
    const association = await Association.findByPk(id);

    if (!association) {
      return res.status(404).json({
        success: false,
        message: "Association non trouvée",
      });
    }

    // 3. Suppression en cascade des données liées

    // 3a. Récupérer tous les animaux de cette association
    const animals = await Animal.findAll({ where: { id_association: id } });

    // 3b. Supprimer toutes les demandes liées aux animaux de cette association
    for (const animal of animals) {
      const animalRequests = await Request.findAll({
        where: { id_animal: animal.id_animal },
      });
      for (const request of animalRequests) {
        await request.destroy();
      }
    }

    // 3c. Supprimer tous les animaux de cette association
    await Animal.destroy({ where: { id_association: id } });

    // 3d. Récupérer tous les utilisateurs de cette association
    const users = await User.findAll({ where: { id_association: id } });

    // 3e. Supprimer toutes les demandes des utilisateurs de cette association
    for (const user of users) {
      const userRequests = await Request.findAll({
        where: { id_user: user.id_user },
      });
      for (const request of userRequests) {
        await request.destroy();
      }
    }

    // 3f. Détacher les utilisateurs de l'association (les remettre en foster)
    const fosterRole = await Role.findOne({ where: { label: "foster" } });
    await User.update(
      {
        id_association: null,
        id_role: fosterRole.id_role,
      },
      { where: { id_association: id } }
    );

    // 4. Supprimer l'association
    await association.destroy();

    // 5. Log de sécurité pour action admin
    if (req.user.role && req.user.role.label === "admin") {
      console.log(
        `🔒 ADMIN ACTION: Association ${id} deleted by admin ${req.user.id_user} (${req.user.email})`
      );
    }

    // 6. Retourner la confirmation de suppression
    res.json({
      success: true,
      message:
        "Association supprimée avec succès (suppression en cascade appliquée)",
      data: {
        deleted_association_id: id,
        deleted_association_name: association.name,
        cascade_deletions: {
          animals: animals.length,
          users_detached: users.length,
        },
        admin_action:
          req.user.role && req.user.role.label === "admin" ? true : false,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'association:", error);
    next(error);
  }
};

/**
 * CONTRÔLEUR : Créer une nouvelle association
 * POST /api/associations/create
 * Headers: Authorization: Bearer <token>
 * Body: { name, email, phone, address }
 */
export const createAssociation = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user.id_user;

    // 1. Vérifier que l'utilisateur n'est pas déjà rattaché à une association
    if (req.user.id_association) {
      return res.status(400).json({
        success: false,
        message: "Vous êtes déjà rattaché à une association",
      });
    }

    // 2. Vérifier l'unicité de l'email
    const existingAssociation = await Association.findOne({ where: { email } });
    if (existingAssociation) {
      return res.status(400).json({
        success: false,
        message: "Email déjà utilisé",
      });
    }

    // 3. Créer l'association
    const association = await Association.create({
      name,
      email,
      phone,
      address,
    });

    // 4. Rattacher l'utilisateur à l'association
    await User.update(
      { id_association: association.id_association },
      { where: { id_user: userId } }
    );

    // 5. Récupérer l'utilisateur mis à jour
    const updatedUser = await User.findByPk(userId, {
      include: [
        { model: Role, as: "role" },
        { model: Association, as: "association" },
      ],
      attributes: { exclude: ["password"] },
    });

    // 6. Générer un nouveau token avec l'association
    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      message: "Association créée avec succès",
      data: {
        user: updatedUser,
        association: association,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Rejoindre une association existante
 * POST /api/associations/:id/join
 * Headers: Authorization: Bearer <token>
 */
export const joinAssociation = async (req, res, next) => {
  try {
    const { id: association_id } = req.params;
    const userId = req.user.id_user;

    // 1. Vérifier que l'utilisateur n'est pas déjà rattaché à une association
    if (req.user.id_association) {
      return res.status(400).json({
        success: false,
        message: "Vous êtes déjà rattaché à une association",
      });
    }

    // 2. Vérifier que l'association existe
    const association = await Association.findByPk(association_id);
    if (!association) {
      return res.status(404).json({
        success: false,
        message: "Association non trouvée",
      });
    }

    // 3. Rattacher l'utilisateur à l'association
    await User.update(
      { id_association: association_id },
      { where: { id_user: userId } }
    );

    // 4. Récupérer l'utilisateur mis à jour
    const updatedUser = await User.findByPk(userId, {
      include: [
        { model: Role, as: "role" },
        { model: Association, as: "association" },
      ],
      attributes: { exclude: ["password"] },
    });

    // 5. Générer un nouveau token avec l'association
    const token = generateToken(userId);

    res.json({
      success: true,
      message: "Vous avez rejoint l'association avec succès",
      data: {
        user: updatedUser,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Quitter une association
 * POST /api/associations/leave
 * Headers: Authorization: Bearer <token>
 */
export const leaveAssociation = async (req, res, next) => {
  try {
    const userId = req.user.id_user;

    // 1. Vérifier que l'utilisateur est rattaché à une association
    if (!req.user.id_association) {
      return res.status(400).json({
        success: false,
        message: "Vous n'êtes rattaché à aucune association",
      });
    }

    // 2. Retirer l'utilisateur de l'association
    await User.update({ id_association: null }, { where: { id_user: userId } });

    // 3. Récupérer l'utilisateur mis à jour
    const updatedUser = await User.findByPk(userId, {
      include: [
        { model: Role, as: "role" },
        { model: Association, as: "association" },
      ],
      attributes: { exclude: ["password"] },
    });

    // 4. Générer un nouveau token sans association
    const token = generateToken(userId);

    res.json({
      success: true,
      message: "Vous avez quitté l'association avec succès",
      data: {
        user: updatedUser,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
