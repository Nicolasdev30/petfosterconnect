/**
 * MODÈLE RÔLE (SEQUELIZE ORM)
 * 
 * Définit les rôles disponibles dans l'application :
 * - "utilisateur" : Famille d'accueil (peut faire des demandes)
 * - "association" : Gestionnaire (peut gérer animaux et demandes)
 * - "admin" : Administrateur système (accès complet)
 * 
 * Caractéristiques :
 * - Table de référence (données statiques)
 * - Labels uniques pour éviter les doublons
 * - Pas de timestamps (données de configuration)
 * 
 * Utilisation :
 * - Contrôle d'accès dans les middlewares
 * - Basculement de rôles pour utilisateurs multi-casquettes
 * - Validation des permissions dans les contrôleurs
 */
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

/**
 * MODÈLE : Role - Rôles des utilisateurs
 * Table : role
 * Description : Définit les rôles disponibles (famille, association, admin)
 */
const Role = sequelize.define(
  "Role",
  {
    // Clé primaire auto-incrémentée
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Label du rôle (famille, association, admin)
    label: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true, 
    },
  },
  {
    tableName: "role", // Nom exact de la table
    timestamps: false,
  }
);

export default Role;
