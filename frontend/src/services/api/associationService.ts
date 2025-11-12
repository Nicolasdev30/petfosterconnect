/**
 * SERVICE DE GESTION DES ASSOCIATIONS
 * 
 * Gère toutes les opérations liées aux associations :
 * - Liste des associations avec recherche
 * - Détails d'une association avec ses animaux
 * - Création d'association (rattachement automatique)
 * - Récupération des noms et villes pour filtres
 * 
 * Fonctionnalités métier :
 * - Recherche par nom et ville
 * - Création avec rattachement automatique de l'utilisateur
 * - Gestion des erreurs de validation (email unique, etc.)
 * - Support de la pagination
 */
import axios from "axios";

import { ApiClient } from "../client";
import type {
  Association,
  AssociationExtended,
  AssociationResponse,
  AssociationsResponse,
} from "../../types/association";
import type { AssociationForm } from "../../types/form";
import type { AuthUser } from "../../types/user";

export class AssociationService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getAssociations(params?: {
    name?: string;
    city?: string;
  }): Promise<Association[]> {
    try {
      const response = await this.axios.get<AssociationsResponse>(
        "/api/associations",
        { params }
      );
      return response.data.data.associations;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return []; // Retourner un tableau vide si aucune association
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw error;
    }
  }

  public async getAssociationNames(): Promise<string[]> {
    try {
      const response = await this.axios.get<{
        success: boolean;
        data: { names: string[] };
      }>("/api/associations/names");
      return response.data.data.names;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return []; // Retourner un tableau vide si aucun nom
        }
      }
      throw error;
    }
  }

  public async getAssociationCities(): Promise<string[]> {
    try {
      const response = await this.axios.get<{
        success: boolean;
        data: { cities: string[] };
      }>("/api/associations/cities");
      return response.data.data.cities;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return []; // Retourner un tableau vide si aucune ville
        }
      }
      throw error;
    }
  }

  public async getAssociationById(id: string): Promise<AssociationExtended> {
    try {
      const response = await this.axios.get<AssociationResponse>(
        `/api/associations/${id}`
      );
      return response.data.data.association;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Association non trouvée");
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw error;
    }
  }

  public async post(data: AssociationForm): Promise<Association> {
    try {
      // TODO Add association id from authContext to data
      const response = await this.axios.post<Association>(
        "/associations",
        data,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400 || error.response?.status === 409) {
          throw new Error(error.message);
        }
      }
      throw error;
    }
  }

  public async createAssociation(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }): Promise<{ user: AuthUser; association: Association }> {
    try {
      const response = await this.axios.post<{
        success: boolean;
        message: string;
        data: {
          user: AuthUser;
          association: Association;
        };
      }>(
        "/api/associations/create",
        data,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400 || error.response?.status === 409) {
          throw new Error(error.response.data?.message || error.message);
        }
      }
      throw error;
    }
  }
}