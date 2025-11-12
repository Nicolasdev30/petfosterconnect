/**
 * SERVICE DE GESTION DES ANIMAUX
 * 
 * Gère toutes les opérations CRUD sur les animaux :
 * - Récupération de la liste avec filtres (espèce, race, âge)
 * - Détails d'un animal spécifique
 * - Création d'animaux (réservé aux associations)
 * - Récupération des espèces disponibles pour les filtres
 * 
 * Fonctionnalités :
 * - Filtrage avancé par critères multiples
 * - Gestion des erreurs 404 (retour de tableaux vides)
 * - Validation des permissions (seules les associations créent)
 * - Optimisation des requêtes avec pagination
 */
import axios from "axios";

import { ApiClient } from "../client";
import type {
  Animal,
  AnimalExtended,
  AnimalResponse,
  AnimalsResponse,
} from "../../types/animal";
import type { AnimalForm } from "../../types/form";

export class AnimalService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getAnimals(params?: {
    species?: string;
    breed?: string;
    age?: string;
  }): Promise<Animal[]> {
    try {
      const response = await this.axios.get<AnimalsResponse>("/api/animals", {
        params,
      });
      return response.data.data.animals;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return []; // Retourner un tableau vide si aucun animal
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw error;
    }
  }

  public async getSpecies(): Promise<string[]> {
    try {
      const response = await this.axios.get<{
        success: boolean;
        data: { species: string[] };
      }>("/api/animals/species");
      return response.data.data.species;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return []; // Retourner un tableau vide si aucune espèce
        }
      }
      throw error;
    }
  }

  public async getAnimalById(id: string): Promise<AnimalExtended> {
    try {
      const response = await this.axios.get<AnimalResponse>(
        `/api/animals/${id}`
      );
      return response.data.data.animal;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Animal non trouvé");
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw error;
    }
  }

  // + AJOUTÉ : Méthode pour créer un nouvel animal
  public async createAnimal(data: AnimalForm): Promise<Animal> {
    try {
      const response = await this.axios.post<AnimalResponse>("/api/animals", data, {
        withCredentials: true,
      });
      return response.data.data.animal;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403 || error.response?.status === 400) {
          throw new Error(error.response.data?.message || error.message);
        }
      }
      throw error;
    }
  }

  // Méthode pour modifier un animal
  public async updateAnimal(id: string, data: Partial<AnimalForm>): Promise<Animal> {
    try {
      const response = await this.axios.patch<AnimalResponse>(`/api/animals/${id}`, data, {
        withCredentials: true,
      });
      return response.data.data.animal;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw error;
    }
  }

  // Méthode pour supprimer un animal
  public async deleteAnimal(id: string): Promise<void> {
    try {
      await this.axios.delete(`/api/animals/${id}`, {
        withCredentials: true,
      });
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