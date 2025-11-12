/**
 * CONTRÔLEURS DE GESTION DES ANIMAUX
 * 
 * Gère toutes les opérations CRUD sur les animaux :
 * 
 * getAllAnimals :
 * - Liste paginée avec filtres avancés
 * - Filtres : espèce, race, âge par tranches, statut, association
 * - Recherche insensible à la casse
 * - Inclusion des données d'association
 * 
 * getAnimalById :
 * - Détails complets d'un animal
 * - Informations de l'association responsable
 * - Accessible publiquement (pas d'auth requise)
 * 
 * createAnimal :
 * - Création réservée aux associations
 * - Vérification d'appartenance à une association
 * - Statut par défaut "disponible"
 * 
 * updateAnimal :
 * - Modification par l'association propriétaire uniquement
 * - Mise à jour partielle (seuls les champs envoyés)
 * - Vérification des permissions stricte
 * 
 * getSpecies :
 * - Liste des espèces disponibles pour les filtres
 * - Données distinctes et triées
 */
import { Animal, Association } from "../models/index.js";
import { Request } from "../models/index.js";
import { sequelize } from "../config/database.js";
import { Op } from "sequelize";

/**
 * CONTRÔLEUR : Récupérer tous les animaux avec filtres optionnels
 * GET /api/animals
 * Query params: species, breed, age, status, association, page, limit
 */
export const getAllAnimals = async (req, res, next) => {
  try {
    const {
      species,
      breed,
      age,
      status,
      association,
      page = 1,
      limit = 10,
    } = req.query;
    const whereConditions = {};

    // Filtre par espèce (recherche partielle insensible à la casse)
    let allAnimals = await Animal.findAll({
      include: [
        {
          model: Association,
          as: "association",
          attributes: ["id_association", "name", "email", "phone", "address"],
        },
      ],
      order: [["id_animal", "DESC"]],
    });
    // Filtre par espèce si l'utilisateur en a demandé une
    if (species) {
      allAnimals = allAnimals.filter((animal) =>
        // Pour chaque animal, on vérifie s'il a une espèce qui contient le texte recherché
        animal.species
          ? animal.species.toLowerCase().includes(species.toLowerCase())
          : false
      );
    }

    // Filtre par race si l'utilisateur en a demandé une
    if (breed) {
      allAnimals = allAnimals.filter((animal) =>
        animal.breed
          ? animal.breed.toLowerCase().includes(breed.toLowerCase())
          : false
      );
    }

    // Filtre par âge si l'utilisateur en a demandé un
    if (age) {
      const ageFilter = parseInt(age);
      allAnimals = allAnimals.filter((animal) => {
        if (!animal.age) return false;

        // Logique de filtrage par tranche d'âge
        switch (ageFilter) {
          case 0: // moins d'un an
            return animal.age < 1;
          case 1: // 1 à 5 ans
            return animal.age >= 1 && animal.age <= 5;
          case 2: // 5 à 10 ans
            return animal.age >= 5 && animal.age <= 10;
          case 3: // plus de 10 ans
            return animal.age > 10;
          default:
            return true;
        }
      });
    }

    // Filtre par statut si l'utilisateur en a demandé un
    if (status) {
      allAnimals = allAnimals.filter((animal) => animal.status === status);
    }

    // Filtre par nom d'association si l'utilisateur en a demandé une
    if (association) {
      allAnimals = allAnimals.filter((animal) =>
        // Pour chaque animal, on vérifie si son association a un nom qui contient le texte recherché
        animal.association && animal.association.name
          ? animal.association.name
              .toLowerCase()
              .includes(association.toLowerCase())
          : false
      );
    }
    // Pagination
    const count = allAnimals.length;
    const start = (page - 1) * limit;
    const rows = allAnimals.slice(start, start + parseInt(limit));
    res.json({
      success: true,
      data: {
        animals: rows,
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
 * CONTRÔLEUR : Récupérer un animal spécifique par son ID
 * GET /api/animals/:id
 */
export const getAnimalById = async (req, res, next) => {
  try {
    // 1. Récupérer l'ID depuis les paramètres d'URL
    const { id } = req.params;

    // 2. Chercher l'animal avec ses informations d'association
    const animal = await Animal.findByPk(id, {
      include: [
        {
          model: Association,
          as: "association",
          attributes: ["id_association", "name", "email", "phone", "address"],
        },
      ],
    });

    // 3. Vérifier si l'animal existe
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal non trouvé",
      });
    }

    // 4. Renvoyer les détails de l'animal
    res.json({
      success: true,
      data: {
        animal,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Créer un nouvel animal (réservé aux associations)
 * POST /api/animals
 * Body: { name, species, breed, age, sex, description, photo_url, status }
 */
export const createAnimal = async (req, res, next) => {
  try {
    // 1. Récupérer les données du formulaire
    const { name, species, breed, age, sex, description, photo_url, status } =
      req.body;

    // 2. Vérifier que l'utilisateur connecté appartient à une association
    // (req.user vient du middleware d'authentification)
    if (!req.user.id_association) {
      return res.status(403).json({
        success: false,
        message:
          "Vous devez être membre d'une association pour créer un animal",
      });
    }

    // 3. Créer l'animal en base de données
    const animal = await Animal.create({
      name,
      species,
      breed,
      age,
      sex,
      description,
      photo_url,
      status: status || "disponible", // Statut par défaut
      id_association: req.user.id_association, // Association de l'utilisateur
    });

    // 4. Récupérer l'animal créé avec les informations de l'association
    const animalWithAssociation = await Animal.findByPk(animal.id_animal, {
      include: [
        {
          model: Association,
          as: "association",
          attributes: ["id_association", "name", "email", "phone", "address"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Animal créé avec succès",
      data: {
        animal: animalWithAssociation,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Modifier un animal existant
 * PATCH /api/animals/:id
 * Body: { name, species, breed, age, sex, description, photo_url, status }
 */
export const updateAnimal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, species, breed, age, sex, description, photo_url, status } =
      req.body;

    const animal = await Animal.findByPk(id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal non trouvé",
      });
    }

    // Vérifier que l'utilisateur peut modifier cet animal
    if (animal.id_association !== req.user.id_association) {
      return res.status(403).json({
        success: false,
        message: "Vous ne pouvez modifier que les animaux de votre association",
      });
    }

    await animal.update({
      name: name || animal.name,
      species: species || animal.species,
      breed: breed || animal.breed,
      age: age !== undefined ? age : animal.age,
      sex: sex || animal.sex,
      description: description || animal.description,
      photo_url: photo_url || animal.photo_url,
      status: status || animal.status,
    });

    // Récupérer l'animal mis à jour avec ses relations
    const updatedAnimal = await Animal.findByPk(id, {
      include: [
        {
          model: Association,
          as: "association",
          attributes: ["id_association", "name", "email", "phone", "address"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Animal mis à jour avec succès",
      data: {
        animal: updatedAnimal,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un animal
 * DELETE /api/animals/:id
 */
export const deleteAnimal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const animal = await Animal.findByPk(id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal non trouvé",
      });
    }

    // Vérifier que l'utilisateur peut supprimer cet animal
    if (animal.id_association !== req.user.id_association) {
      return res.status(403).json({
        success: false,
        message:
          "Vous ne pouvez supprimer que les animaux de votre association",
      });
    }

    // Supprimer toutes les demandes liées à cet animal
    await Request.destroy({ where: { id_animal: id } });

    await animal.destroy();

    res.json({
      success: true,
      message: "Animal supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CONTRÔLEUR : Récupérer toutes les espèces disponibles
 * GET /api/animals/species
 */
export const getSpecies = async (req, res, next) => {
  try {
    // Récupérer toutes les espèces distinctes
    const species = await Animal.findAll({
      attributes: ["species"],
      group: ["species"],
      where: {
        species: {
          [Op.ne]: null, // Exclure les valeurs null
        },
      },
      order: [["species", "ASC"]],
    });

    // Extraire uniquement les noms d'espèces
    const speciesList = species
      .map((animal) => animal.species)
      .filter((species) => species && species.trim() !== ""); // Filtrer les valeurs vides

    res.json({
      success: true,
      data: {
        species: speciesList,
      },
    });
  } catch (error) {
    next(error);
  }
};
