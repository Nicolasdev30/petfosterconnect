import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les fichiers YAML de documentation
const loadSwaggerYaml = (filename) => {
  const filePath = path.join(__dirname, `../docs/swagger/${filename}.yaml`);
  return YAML.load(filePath);
};

// Charger toutes les documentations
const generalPaths = loadSwaggerYaml("general");
const authPaths = loadSwaggerYaml("auth");
const animalsPaths = loadSwaggerYaml("animals");
const associationsPaths = loadSwaggerYaml("associations");
const requestsPaths = loadSwaggerYaml("requests");
const adminPaths = loadSwaggerYaml("admin");

// Fusionner tous les paths
const allPaths = {
  ...generalPaths.paths,
  ...authPaths.paths,
  ...animalsPaths.paths,
  ...associationsPaths.paths,
  ...requestsPaths.paths,
  ...adminPaths.paths,
};

/**
 * Configuration Swagger pour la documentation API
 * Génère automatiquement la documentation à partir des commentaires JSDoc
 */

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pet Foster Connect API",
      version: "1.0.0",
      description: `
        API REST pour la plateforme Pet Foster Connect.
        
        **Fonctionnalités principales :**
        - 🐕 Gestion des animaux en adoption
        - 🏠 Gestion des associations de protection animale  
        - 👥 Système d'authentification et de rôles
        - 📋 Gestion des demandes d'adoption
        
        **Rôles utilisateurs :**
        - **famille** : Peut consulter et faire des demandes d'adoption
        - **association** : Peut gérer ses animaux et associations
        - **admin** : Accès complet à toutes les fonctionnalités
      `,
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur de développement",
      },
    ],
    paths: allPaths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtenu lors de la connexion",
        },
      },
      schemas: {
        Animal: {
          type: "object",
          required: ["name", "species", "age", "id_association"],
          properties: {
            id_animal: {
              type: "integer",
              description: "Identifiant unique de l'animal",
            },
            name: {
              type: "string",
              description: "Nom de l'animal",
              example: "Rex",
            },
            species: {
              type: "string",
              description: "Espèce de l'animal",
              example: "Chien",
            },
            breed: {
              type: "string",
              description: "Race de l'animal",
              example: "Berger Allemand",
            },
            age: {
              type: "integer",
              minimum: 0,
              description: "Âge de l'animal en années",
              example: 5,
            },
            description: {
              type: "string",
              description: "Description détaillée de l'animal",
              example: "Gentil chien protecteur, très loyal",
            },
            photo_url: {
              type: "string",
              format: "uri",
              description: "URL de la photo de l'animal",
            },
            status: {
              type: "string",
              enum: ["disponible", "accueilli", "pending"],
              description: "Statut d'adoption de l'animal",
            },
            id_association: {
              type: "integer",
              description: "ID de l'association responsable",
            },
          },
        },
        Association: {
          type: "object",
          required: ["name", "email", "phone", "address"],
          properties: {
            id_association: {
              type: "integer",
              description: "Identifiant unique de l'association",
            },
            name: {
              type: "string",
              description: "Nom de l'association",
              example: "Refuge des 4 Pattes",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email de contact",
              example: "contact@4pattes.org",
            },
            phone: {
              type: "string",
              description: "Numéro de téléphone",
              example: "0123456789",
            },
            address: {
              type: "string",
              description: "Adresse complète",
              example: "12 rue des Animaux, 75011 Paris",
            },
          },
        },
        User: {
          type: "object",
          required: ["email", "password", "first_name", "last_name", "role"],
          properties: {
            id_user: {
              type: "integer",
              description: "Identifiant unique de l'utilisateur",
            },
            email: {
              type: "string",
              format: "email",
              description: "Adresse email (unique)",
              example: "jean.dupont@email.com",
            },
            password: {
              type: "string",
              minLength: 8,
              description:
                "Mot de passe (min 8 caractères, majuscule, minuscule, chiffre)",
              example: "MotDePasse123",
            },
            first_name: {
              type: "string",
              description: "Prénom",
              example: "Jean",
            },
            last_name: {
              type: "string",
              description: "Nom de famille",
              example: "Dupont",
            },
            role: {
              type: "string",
              enum: ["famille", "association", "admin"],
              description: "Rôle de l'utilisateur",
            },
          },
        },
        Request: {
          type: "object",
          required: ["id_user", "id_animal", "message"],
          properties: {
            id_request: {
              type: "integer",
              description: "Identifiant unique de la demande",
            },
            id_user: {
              type: "integer",
              description: "ID de l'utilisateur demandeur",
            },
            id_animal: {
              type: "integer",
              description: "ID de l'animal demandé",
            },
            message: {
              type: "string",
              description: "Message de motivation",
              example: "Je souhaite adopter ce chien car...",
            },
            status: {
              type: "string",
              enum: ["pending", "accepted", "rejected"],
              description: "Statut de la demande",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Date de création",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Message d'erreur",
              example: "Ressource non trouvée",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    description: "Champ en erreur",
                  },
                  message: {
                    type: "string",
                    description: "Message d'erreur spécifique",
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Vérification de l'état de l'API",
      },
      {
        name: "Authentication",
        description: "Inscription, connexion et gestion des utilisateurs",
      },
      {
        name: "Animals",
        description: "Gestion des animaux en adoption",
      },
      {
        name: "Associations",
        description: "Gestion des associations de protection animale",
      },
      {
        name: "Requests",
        description: "Gestion des demandes d'adoption",
      },
      {
        name: "Admin",
        description: "Administration système - Accès administrateur uniquement",
      },
    ],
  },
  apis: [], // Plus besoin de scanner les fichiers JS
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
