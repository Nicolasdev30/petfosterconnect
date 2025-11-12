/**
 * CONFIGURATION GLOBALE DE L'APPLICATION
 * 
 * Classe singleton pour centraliser la configuration :
 * - URL de base de l'API
 * - Validation des variables d'environnement
 * - Pattern singleton pour éviter les instances multiples
 * 
 * Avantages :
 * - Configuration centralisée et réutilisable
 * - Validation au démarrage de l'application
 * - Type-safety avec TypeScript
 */
export class Config {
  private static instance: Config;

  readonly baseUrl: string;

  private constructor() {
    // Si VITE_API_URL est défini et non vide, l'utiliser
    // Sinon utiliser "/" pour les URLs relatives (proxy nginx)
    const apiUrl = import.meta.env.VITE_API_URL;
    this.baseUrl = apiUrl && apiUrl.trim() !== "" ? apiUrl : "/";
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
      Config.check(Config.instance);
    }
    return Config.instance;
  }

  private static check(config: Config) {
    // baseUrl peut être "/" pour les URLs relatives via proxy
    if (!config.baseUrl) throw new Error("API URL configuration error");
  }
}
