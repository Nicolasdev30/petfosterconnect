/**
 * MODÈLE UTILISATEUR (SEQUELIZE ORM)
 * 
 * Représente les utilisateurs de la plateforme :
 * - Familles d'accueil (rôle "utilisateur")
 * - Gestionnaires d'associations (rôle "association")
 * - Administrateurs système (rôle "admin")
 * 
 * Champs :
 * - Informations personnelles : prénom, nom, email
 * - Authentification : mot de passe hashé Argon2
 * - Relations : rôle (obligatoire), association (optionnel)
 * 
 * Contraintes de sécurité :
 * - Email unique pour éviter les doublons
 * - Validation email intégrée Sequelize
 * - Mot de passe jamais exposé dans les réponses API
 * - Clés étrangères avec contraintes d'intégrité
 * 
 * Relations :
 * - belongsTo Role : Un utilisateur a un rôle
 * - belongsTo Association : Optionnel pour gestionnaires
 * - hasMany Request : Historique des demandes
 */
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Role from "./Role.js";
import Association from "./Association.js";

/**
 * MODÈLE : User - Utilisateurs de l'application
 * Table : user
 * Description : Familles d'accueil et membres d'associations
 */
const User = sequelize.define(
  "User",
  {
    // Clé primaire auto-incrémentée
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Prénom utilisateur
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    // Nom de famille
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    // Email unique pour connexion
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // Mot de passe hashé
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Clé étrangère vers role (obligatoire)
    id_role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id_role",
      },
    },
    // Clé étrangère vers association
    id_association: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Association,
        key: "id_association",
      },
    },
  },
  {
    tableName: "user", // Nom exact de la table
    timestamps: false,
  }
);

export default User;
