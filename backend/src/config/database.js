/**
 * CONFIGURATION DE LA BASE DE DONNÉES POSTGRESQL
 * 
 * Établit la connexion à PostgreSQL via Sequelize ORM :
 * - Configuration via variable d'environnement DB_URL
 * - Paramètres Sequelize (timestamps, underscored)
 * - Test de connexion au démarrage
 * 
 * Sécurité :
 * - Credentials externalisés dans .env
 * - Gestion des erreurs de connexion
 * - Configuration adaptée à l'environnement (dev/prod)
 */
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  define: {
    timestamps: true,
    underscored: true,
  },
});

// Test de la connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion à la base de données établie avec succès.");
  } catch (error) {
    console.error("❌ Impossible de se connecter à la base de données:", error);
  }
};

export { sequelize, testConnection };
