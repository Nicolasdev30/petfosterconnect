/**
 * SERVICE DE GESTION DES DEMANDES D'ACCUEIL
 * 
 * Gère le workflow complet des demandes d'adoption :
 * - Création de demandes par les familles d'accueil
 * - Réponse aux demandes par les associations (accepter/refuser)
 * 
 * Workflow métier :
 * 1. Famille voit un animal et fait une demande
 * 2. Association reçoit la demande et peut l'accepter/refuser
 * 3. Si acceptée, l'animal passe en statut "accueilli"
 * 
 * Sécurité :
 * - Vérification des permissions (famille vs association)
 * - Validation des statuts (pending, accepted, refused)
 */
import axios from "axios";

import { ApiClient } from "../client";
import type { RequestResponse } from "../../types/request";

export class RequestService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async createRequest(
    id_animal: string,
    id_user: string,
  ): Promise<RequestResponse> {
    try {
      console.log("📤 Sending request to /api/requests with:", { id_animal, id_user });
      const response = await this.axios.post<RequestResponse>("/api/requests", {
        id_animal: id_animal,
        id_user: id_user,
      }, {
        withCredentials: true,
      });

      console.log("✅ Request response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Request error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw error;
    }
  }

  public async answerToRequest(
    id_request: string,
    status: string,
  ): Promise<RequestResponse> {
    try {
      const response = await this.axios.patch<RequestResponse>(
        `/api/requests/${id_request}`,
        {
          id_request: id_request,
          status: status,
        },
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
}
