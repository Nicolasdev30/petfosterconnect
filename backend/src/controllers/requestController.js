/**
 * CONTRÔLEURS DE GESTION DES DEMANDES D'ACCUEIL
 * 
 * Gère le workflow complet des demandes d'adoption :
 * 
 * createRequest :
 * - Création par les familles d'accueil uniquement
 * - Vérifications : animal disponible, pas de doublon
 * - Statut initial "pending"
 * - Relations complètes (utilisateur, animal, association)
 * 
 * getUserRequests :
 * - Demandes faites par l'utilisateur connecté
 * - Filtrage par statut optionnel
 * - Pagination et tri par date
 * 
 * getReceivedRequests :
 * - Demandes reçues par l'association
 * - Filtrage par animal et statut
 * - Accessible aux gestionnaires uniquement
 * 
 * updateRequestStatus :
 * - Acceptation/refus par l'association
 * - Logique métier : acceptation → animal "accueilli"
 * - Vérification de propriété de l'animal
 * 
 * getRequestById :
 * - Détails d'une demande spécifique
 * - Contrôle d'accès : propriétaire OU association
 * 
 * Workflow métier :
 * pending → accepted (animal devient "accueilli")
 * pending → refused (animal reste "disponible")
 */
import { Request, Role, Animal, User, Association } from "../models/index.js";

/**
 * CONTRÔLEUR : Créer une demande d'accueil (famille d'accueil)
 * POST /api/requests
 * Body: { id_animal, message }
 */
export const createRequest = async (req, res, next) => {
  try {
    // 1. Récupérer les données du formulaire
    const { id_animal, id_user } = req.body;

    // 2. Vérifier que l'utilisateur a le rôle foster
    // (seules les familles peuvent faire des demandes)
    const user = await User.findByPk(id_user, {
      include: [
        { model: Role, as: "role" },
        { model: Association, as: "association" },
        { model: Request, as: "requests" },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    if (user.role.label !== "utilisateur") {
      return res.status(403).json({
        success: false,
        message: "Seules les familles d'accueil peuvent faire des demandes",
      });
    }

    // 3. Vérifier que l'animal existe et est disponible
    const animal = await Animal.findByPk(id_animal, {
      include: [{ model: Association, as: "association" }],
    });

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal non trouvé",
      });
    }

    // 4. Vérifier le statut: 'disponible' ou 'accueilli'
    if (animal.status !== "disponible") {
      return res.status(400).json({
        success: false,
        message: "Cet animal n'est plus disponible",
      });
    }

    // 5. Éviter les doublons : une demande en cours par utilisateur/animal
    const existingRequest = await Request.findOne({
      where: {
        id_user: id_user,
        id_animal: id_animal,
        status: "pending", //statut par défaut
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Vous avez déjà une demande en cours pour cet animal",
      });
    }

    // 6. Créer la demande
    const request = await Request.create({
      id_user: id_user, // Référence utilisateur (NOT NULL)
      id_animal: id_animal, // Référence animal (NOT NULL)// Message optionnel (TEXT)
      status: "pending", // Statut par défaut du MPD
      // created_at est automatique (DEFAULT CURRENT_TIMESTAMP)
    });

    // 7. Récupérer la demande créée avec toutes ses relations
    const requestWithDetails = await Request.findByPk(request.id_request, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id_user", "first_name", "last_name", "email"],
        },
        {
          model: Animal,
          as: "animal",
          attributes: ["id_animal", "name", "species", "breed"],
          include: [
            {
              model: Association,
              as: "association",
              attributes: ["id_association", "name", "email"],
            },
          ],
        },
      ],
    });

    // 8. Renvoyer la demande créée
    res.status(201).json({
      success: true,
      message: "Demande créée avec succès",
      data: {
        request: requestWithDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer les demandes de l'utilisateur connecté (famille)
export const getUserRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Vérifier que l'utilisateur a le rôle foster
    if (req.user.role.label !== "utilisateur") {
      return res.status(403).json({
        success: false,
        message: "Accès réservé aux familles d'accueil",
      });
    }

    let allRequests = await Request.findAll({
      where: { id_user: req.user.id_user },
      include: [
        {
          model: Animal,
          as: "animal",
          attributes: ["id_animal", "name", "species", "breed", "photo_url"],
          include: [
            {
              model: Association,
              as: "association",
              attributes: ["id_association", "name", "email"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Si un statut spécifique est demandé, on filtre les demandes par statut
    if (status) {
      allRequests = allRequests.filter((demande) => {
        return demande.status === status;
      });
    }

    const count = allRequests.length;
    const start = (page - 1) * limit;
    const rows = allRequests.slice(start, start + parseInt(limit));

    res.json({
      success: true,
      data: {
        requests: rows,
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

// Récupérer les demandes reçues pour les animaux de l'association
export const getReceivedRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Vérifier que l'utilisateur a le rôle association
    if (req.user.role.label !== "association") {
      return res.status(403).json({
        success: false,
        message: "Accès réservé aux associations",
      });
    }

    if (!req.user.id_association) {
      return res.status(400).json({
        success: false,
        message: "Vous devez être membre d'une association",
      });
    }

    let allRequests = await Request.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id_user", "first_name", "last_name", "email"],
        },
        {
          model: Animal,
          as: "animal",
          attributes: [
            "id_animal",
            "name",
            "species",
            "breed",
            "photo_url",
            "id_association",
          ],
          include: [
            {
              model: Association,
              as: "association",
              attributes: ["id_association", "name"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Filtrer les demandes pour ne garder que celles des animaux de l'association courante
    // On parcourt toutes les demandes et on ne garde que celles où l'animal appartient à notre association
    allRequests = allRequests.filter((demande) => {
      return (
        demande.animal &&
        demande.animal.id_association === req.user.id_association
      );
    });

    // Si un statut spécifique est demandé, on filtre encore par statut
    if (status) {
      allRequests = allRequests.filter((demande) => {
        return demande.status === status;
      });
    }

    const count = allRequests.length;
    const start = (page - 1) * limit;
    const rows = allRequests.slice(start, start + parseInt(limit));

    res.json({
      success: true,
      data: {
        requests: rows,
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
 * CONTRÔLEUR : Modifier le statut d'une demande (association)
 * PATCH /api/requests/:id
 * Body: { status }
 * Statuts conformes au : 'pending', 'accepted', 'refused'
 */
export const updateRequestStatus = async (req, res, next) => {
  try {
    // 1. Récupérer les paramètres
    const { id } = req.params;
    const { id_association, status } = req.body;

    // 2. Vérifier que l'utilisateur a le rôle association
    if (req.user.role.label !== "association") {
      return res.status(403).json({
        success: false,
        message:
          "Seules les associations peuvent modifier le statut des demandes",
      });
    }

    // 3. Valider le statut (CHECK constraint)
    const validStatuses = ["pending", "accepted", "refused"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Valeurs autorisées : ${validStatuses.join(
          ", ",
        )}`,
      });
    }

    // 4. Récupérer la demande avec l'animal et ses relations
    const request = await Request.findByPk(id, {
      include: [
        {
          model: Animal,
          as: "animal",
          include: [{ model: Association, as: "association" }],
        },
        {
          model: User,
          as: "user",
          attributes: ["id_user", "first_name", "last_name", "email"],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Demande non trouvée",
      });
    }

    // 5. Vérifier que l'animal appartient à l'association de l'utilisateur
    // (respect des contraintes métier)
    if (request.animal.id_association !== req.user.id_association) {
      return res.status(403).json({
        success: false,
        message:
          "Vous ne pouvez modifier que les demandes pour vos propres animaux",
      });
    }

    // 6. Mettre à jour le statut de la demande
    await request.update({ status });

    // 7. Logique métier : si accepté, marquer l'animal comme adopté
    // (respecte les statuts du : 'disponible' -> 'accueilli')
    if (status === "accepted") {
      await request.animal.update({ status: "accueilli" });
    }

    // 8. Renvoyer la demande mise à jour
    res.json({
      success: true,
      message: "Statut de la demande mis à jour avec succès",
      data: {
        request,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer une demande par ID
export const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await Request.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id_user", "first_name", "last_name", "email"],
        },
        {
          model: Animal,
          as: "animal",
          attributes: [
            "id_animal",
            "name",
            "species",
            "breed",
            "photo_url",
            "description",
            "id_association",
          ],
          include: [
            {
              model: Association,
              as: "association",
              attributes: ["id_association", "name", "email"],
            },
          ],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Demande non trouvée",
      });
    }

    // Vérifier que l'utilisateur peut voir cette demande
    const canAccess =
      request.id_user === req.user.id_user || // L'utilisateur qui a fait la demande
      (req.user.role.label === "association" &&
        request.animal.id_association === req.user.id_association); // L'association propriétaire de l'animal

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas accès à cette demande",
      });
    }

    res.json({
      success: true,
      data: {
        request,
      },
    });
  } catch (error) {
    next(error);
  }
};
