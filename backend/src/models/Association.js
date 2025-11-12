/**
 * MODÈLE ASSOCIATION (SEQUELIZE ORM)
 * 
 * Représente les associations de protection animale :
 * - Refuges, fondations, organisations bénévoles
 * - Gestionnaires des animaux en attente d'adoption
 * 
 * Champs obligatoires :
 * - name : Nom unique de l'association
 * - email : Contact unique (validation intégrée)
 * - address : Adresse complète pour localisation
 * 
 * Champs optionnels :
 * - phone : Numéro de téléphone de contact
 * 
 * Contraintes métier :
 * - Unicité du nom et de l'email
 * - Validation email automatique Sequelize
 * - Adresse obligatoire pour géolocalisation future
 * 
 * Relations :
 * - hasMany User : Gestionnaires de l'association
 * - hasMany Animal : Animaux pris en charge
 */
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

/**
 * MODÈLE : Association - Associations de protection animale
 * Table : association
 * Description : Organisations qui s'occupent des animaux à adopter
 */
const Association = sequelize.define(
  "Association",
  {
    // Clé primaire auto-incrémentée
    id_association: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Nom de l'association (unique)
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, 
    },
    // Email de contact (unique)
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, 
      validate: {
        isEmail: true,
      },
    },
    // Numéro de téléphone (optionnel)
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // Adresse complète
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "association", // Nom exact de la table
    timestamps: false,
  }
);

export default Association;
