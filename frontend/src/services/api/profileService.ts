/**
 * SERVICE DE GESTION DES PROFILS UTILISATEUR
 * 
 * Gère les opérations sur les profils utilisateur :
 * - Récupération du profil complet avec relations
 * - Mise à jour des informations personnelles
 * - Mise à jour des informations d'association
 * 
 * Relations gérées :
 * - Utilisateur ↔ Rôle (famille, association, admin)
 * - Utilisateur ↔ Association (optionnel)
 * - Utilisateur ↔ Demandes (historique)
 * - Association ↔ Animaux ↔ Demandes (pour les gestionnaires)
 */
import axios from "axios";

import { ApiClient } from "../client";
import type { AuthUser, UserResponse } from "../../types/user";
import type { AssociationUpdateForm, UserUpdateForm } from "../../types/form";

export class ProfileService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getProfile(id_user: string): Promise<AuthUser> {
    try {
      const response = await this.axios.get<UserResponse>("/api/auth/profile", {
        params: { id: id_user },
        withCredentials: true,
      });
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

  public async updateUser(data: UserUpdateForm): Promise<AuthUser> {
    try {
      const response = await this.axios.patch<UserResponse>(
        "/api/auth/update",
        data,
        {
          withCredentials: true,
        }
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

  public async updateAssociation(
    data: AssociationUpdateForm,
    id: string,
  ): Promise<AuthUser> {
    try {
      const response = await this.axios.patch<UserResponse>(
        `/api/associations/${id}`,
        data,
        {
          withCredentials: true,
        }
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
}
