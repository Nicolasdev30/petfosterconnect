/**
 * CONFIGURATION ET RELATIONS DES MODÈLES SEQUELIZE
 * 
 * Centralise la gestion des modèles et leurs relations :
 * 
 * syncDatabase :
 * - Synchronise tous les modèles avec PostgreSQL
 * - Crée les tables si elles n'existent pas
 * - Mode non-destructif (force: false)
 * 
 * Relations définies :
 * 
 * User ↔ Role (N:1) :
 * - Chaque utilisateur a un rôle
 * - Un rôle peut être attribué à plusieurs utilisateurs
 * 
 * User ↔ Association (N:1 optionnel) :
 * - Utilisateurs peuvent être rattachés à une association
 * - Une association peut avoir plusieurs gestionnaires
 * 
 * Animal ↔ Association (N:1) :
 * - Chaque animal appartient à une association
 * - Une association gère plusieurs animaux
 * 
 * Request ↔ User (N:1) :
 * - Chaque demande est faite par un utilisateur
 * - Un utilisateur peut faire plusieurs demandes
 * 
 * Request ↔ Animal (N:1) :
 * - Chaque demande concerne un animal
 * - Un animal peut recevoir plusieurs demandes
 * 
 * Avantages :
 * - Relations automatiques avec Sequelize
 * - Jointures optimisées
 * - Intégrité référentielle garantie
 */
import { sequelize } from "../config/database.js";
import Role from "./Role.js";
import Association from "./Association.js";
import User from "./User.js";
import Animal from "./Animal.js";
import Request from "./Request.js";

/**
 * CONFIGURATION : Synchronisation et initialisation des modèles
 * Gère la création des tables et l'initialisation des données de base
 */

/**
 * FONCTION : Synchronisation de la base de données
 * Synchronise tous les modèles avec la base PostgreSQL
 */
const syncDatabase = async () => {
  try {
    // 1. Synchroniser les modèles avec la base (sans forcer la recréation)
    await sequelize.sync({ force: false });
    console.log("✅ Modèles synchronisés avec la base de données");
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation:", error);
  }
};

// Relations entre les modèles

// Relation User <-> Role
User.belongsTo(Role, { foreignKey: "id_role", as: "role" });
Role.hasMany(User, { foreignKey: "id_role", as: "users" });

// Relation User <-> Association
User.belongsTo(Association, {
  foreignKey: "id_association",
  as: "association",
});
Association.hasMany(User, { foreignKey: "id_association", as: "users" });

// Relation Animal <-> Association
Animal.belongsTo(Association, {
  foreignKey: "id_association",
  as: "association",
});
Association.hasMany(Animal, { foreignKey: "id_association", as: "animals" });

// Relation Request <-> User
Request.belongsTo(User, { foreignKey: "id_user", as: "user" });
User.hasMany(Request, { foreignKey: "id_user", as: "requests" });

// Relation Request <-> Animal
Request.belongsTo(Animal, { foreignKey: "id_animal", as: "animal" });
Animal.hasMany(Request, { foreignKey: "id_animal", as: "requests" });

// Export des modèles et fonctions utilitaires
export { sequelize, Role, Association, User, Animal, Request, syncDatabase };
