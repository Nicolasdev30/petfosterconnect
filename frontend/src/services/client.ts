/**
 * CLIENT API AXIOS CONFIGURÉ
 * 
 * Classe wrapper autour d'Axios pour centraliser la configuration :
 * - Configuration des cookies d'authentification (withCredentials)
 * - Timeout global de 10 secondes
 * - Headers par défaut (Content-Type: application/json)
 * - Intercepteur pour gérer les erreurs 401 (session expirée)
 * 
 * Sécurité :
 * - Envoi automatique des cookies HttpOnly
 * - Gestion des erreurs d'authentification
 * - Configuration CORS appropriée
 */
import axios, { type AxiosInstance } from "axios";

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({ 
      baseURL,
      withCredentials: true, // Permet l'envoi automatique des cookies
      timeout: 10000, // Timeout de 10 secondes
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Intercepteur pour gérer les erreurs d'authentification
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Gestion silencieuse des erreurs 401 (utilisateur non connecté)
          // Pas de log pour éviter de polluer la console
        }
        return Promise.reject(error);
      }
    );
  }

  get instance() {
    return this.axiosInstance;
  }
}
