/**
 * MODÈLE DEMANDE D'ACCUEIL (SEQUELIZE ORM)
 * 
 * Représente les demandes faites par les familles pour adopter des animaux :
 * 
 * Métadonnées :
 * - created_at : Date de création automatique
 * - status : État de la demande avec workflow défini
 * - message : Message optionnel de motivation
 * 
 * Workflow des statuts :
 * - "pending" : En attente de traitement (défaut)
 * - "accepted" : Acceptée par l'association
 * - "refused" : Refusée par l'association
 * 
 * Relations obligatoires :
 * - belongsTo User : Famille qui fait la demande
 * - belongsTo Animal : Animal demandé
 * 
 * Règles métier :
 * - Une demande par utilisateur/animal en cours
 * - Seules les associations peuvent changer le statut
 * - Acceptation → animal passe en "accueilli"
 * 
 * Contraintes de sécurité :
 * - Statuts contrôlés par CHECK constraint
 * - Relations avec ON DELETE RESTRICT (intégrité)
 * - Horodatage automatique pour audit
 */
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./User.js";
import Animal from "./Animal.js";

/**
 * MODÈLE : Request - Demandes d'accueil
 * Table : request
 * Description : Demandes faites par les familles pour adopter/accueillir des animaux
 */
const Request = sequelize.define(
  "Request",
  {
    // Clé primaire auto-incrémentée
    id_request: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Date de création de la demande
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    // Statut de la demande
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pending", // DEFAULT 'pending'
      validate: {
        isIn: [["pending", "accepted", "refused"]], // CHECK constraint
      },
    },
    // Message optionnel de la famille
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Clé étrangère vers user (obligatoire)
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_user",
      },
    },
    // Clé étrangère vers animal (obligatoire)
    id_animal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Animal,
        key: "id_animal",
      },
    },
  },
  {
    tableName: "request", // Nom exact de la table
    timestamps: false,
  }
);

export default Request;
