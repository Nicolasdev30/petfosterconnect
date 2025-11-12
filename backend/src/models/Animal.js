/**
 * MODÈLE ANIMAL (SEQUELIZE ORM)
 * 
 * Représente les animaux en attente d'adoption :
 * 
 * Informations de base :
 * - name : Nom de l'animal (obligatoire)
 * - species : Espèce (Chien, Chat, etc.)
 * - breed : Race spécifique
 * - age : Âge en années (contrainte >= 0)
 * - sex : Sexe (Mâle/Femelle avec validation)
 * 
 * Contenu :
 * - description : Présentation détaillée pour adoption
 * - photo_url : URL de la photo principale
 * 
 * Gestion des statuts :
 * - "disponible" : En attente d'accueil (défaut)
 * - "accueilli" : Placé en famille d'accueil
 * 
 * Relations obligatoires :
 * - belongsTo Association : Chaque animal a une association responsable
 * - hasMany Request : Demandes d'accueil reçues
 * 
 * Contraintes de sécurité :
 * - Âge positif ou nul
 * - Statuts contrôlés par CHECK constraint
 * - Association obligatoire (ON DELETE RESTRICT)
 */
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Association from "./Association.js";

/**
 * MODÈLE : Animal - Animaux à adopter
 * Table : animal
 * Description : Animaux pris en charge par les associations
 */
const Animal = sequelize.define(
  "Animal",
  {
    // Clé primaire auto-incrémentée
    id_animal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Nom de l'animal
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    // Espèce (chien, chat, etc.)
    species: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // Race de l'animal
    breed: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    // Âge en années
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    // Sexe de l'animal
    sex: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        isIn: [["Mâle", "Femelle"]],
      },
    },
    // Description de l'animal
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // URL de la photo
    photo_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Statut de disponibilité
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "disponible", //DEFAULT 'disponible'
      validate: {
        isIn: [["disponible", "accueilli"]], //CHECK constraint
      },
    },
    // Clé étrangère vers association (obligatoire)
    id_association: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Association,
        key: "id_association",
      },
    },
  },
  {
    tableName: "animal", // Nom exact de la table selon MPD
    timestamps: false,
  }
);

export default Animal;
