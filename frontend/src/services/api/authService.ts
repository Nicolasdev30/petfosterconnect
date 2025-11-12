/**
 * SERVICE D'AUTHENTIFICATION
 * 
 * Gère toutes les opérations liées à l'authentification :
 * - Inscription avec validation de mot de passe
 * - Connexion avec gestion des cookies
 * - Récupération du profil utilisateur
 * - Changement de rôle (famille ↔ association)
 * - Déconnexion sécurisée
 * 
 * Sécurité :
 * - Validation regex des mots de passe
 * - Vérification de confirmation de mot de passe
 * - Gestion des erreurs spécifiques (401, 400, etc.)
 * - Cookies HttpOnly pour les tokens JWT
 */
import axios from "axios";

import type { AuthUser, UserExtended, UserResponse } from "../../types/user";
import type {
  UserLoginForm,
  UserRegisterForm,
  RoleSwitchForm,
} from "../../types/form";
import type { LogoutResponse } from "../../types/apiResponse";

import { ApiClient } from "../client";

export class AuthService {
  private axios;
  private passwordRegex;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
    this.passwordRegex = new RegExp(
      "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{};'\":\\\\|,.<>/?`~]).{8,}$",
    );
  }

  public async register(data: UserRegisterForm): Promise<UserResponse> {
    if (!this.passwordRegex.test(data.password)) {
      throw new Error(
        "Le mot de passe ne respecte pas les conditions minimales de sécurité.",
      );
    }

    if (data.password !== data.confirmPassword) {
      throw new Error(
        "Le mot de passe et la confirmation doivent être identique.",
      );
    }

    try {
      const response = await this.axios.post<UserResponse>(
        "/api/auth/register",
        data,
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw error;
    }
  }

  public async login(data: UserLoginForm): Promise<UserExtended> {
    // Note: Pas de validation regex pour le login car les anciens mots de passe
    // peuvent ne pas respecter les nouvelles règles de sécurité.
    // Le backend vérifiera le hash de toute façon.

    try {
      const response = await this.axios.post<UserResponse>(
        "/api/auth/login",
        data,
        {
          withCredentials: true,
        },
      );

      return response.data.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw error;
    }
  }

  public async apiMe(): Promise<AuthUser> {
    try {
      const response = await this.axios.get<UserResponse>("/api/auth/me", {
        withCredentials: true,
      });
      return response.data.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Utilisateur non connecté - comportement normal
          throw new Error("Non connecté");
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw error;
    }
  }

  public async switchRole(data: RoleSwitchForm): Promise<UserResponse> {
    try {
      const response = await this.axios.post<UserResponse>(
        "/api/auth/switch-role",
        data,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw error;
    }
  }

  public async logout(): Promise<LogoutResponse> {
    try {
      const response = await this.axios.post<LogoutResponse>(
        "/api/auth/logout",
        {},
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404 || error.response?.status === 204) {
          throw new Error(error.message);
        }
      }
      throw error;
    }
  }
}
