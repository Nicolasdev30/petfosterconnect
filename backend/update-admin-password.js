/**
 * SCRIPT - MISE À JOUR MOT DE PASSE ADMIN
 *
 * Met à jour le mot de passe admin avec un mot de passe
 * qui respecte les contraintes du frontend
 */

import dotenv from "dotenv";
import argon2 from "argon2";
import { User } from "./src/models/index.js";

dotenv.config();

const updateAdminPassword = async () => {
  try {
    const newPassword = "Admin@123";

    console.log("🔐 Mise à jour du mot de passe admin...\n");

    // Chercher l'utilisateur admin
    const admin = await User.findOne({
      where: { email: "admin@petfosterconnect.com" },
    });

    if (!admin) {
      console.log("❌ Utilisateur admin non trouvé !");
      process.exit(1);
    }

    // Générer le nouveau hash
    const hashedPassword = await argon2.hash(newPassword);

    // Mettre à jour le mot de passe
    admin.password = hashedPassword;
    await admin.save();

    console.log("✅ Mot de passe admin mis à jour avec succès !\n");
    console.log("📧 Email: admin@petfosterconnect.com");
    console.log("🔑 Nouveau mot de passe:", newPassword);
    console.log("\n⚠️  IMPORTANT : Ce mot de passe respecte les contraintes de sécurité :");
    console.log("   - 8+ caractères");
    console.log("   - 1 majuscule (A, P)");
    console.log("   - 1 chiffre (1, 2, 3)");
    console.log("   - 1 caractère spécial (@)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour:", error.message);
    process.exit(1);
  }
};

updateAdminPassword();
