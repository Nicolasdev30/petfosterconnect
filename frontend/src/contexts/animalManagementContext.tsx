/**
 * CONTEXTE DE GESTION DES ANIMAUX POUR LES ASSOCIATIONS
 *
 * Ce contexte gère spécifiquement les opérations CRUD sur les animaux :
 * - Création (déjà géré par modalContext)
 * - Modification (édition d'un animal existant)
 * - Suppression (suppression avec confirmation)
 *
 * POURQUOI UN CONTEXTE SÉPARÉ ?
 * - Le modalContext est générique (connexion, inscription, etc.)
 * - Ici on a besoin de stocker l'animal en cours d'édition
 * - On a besoin de fonctions spécialisées (updateAnimal, deleteAnimal)
 * - Meilleure séparation des responsabilités (Single Responsibility Principle)
 *
 * ARCHITECTURE :
 * - Ce contexte travaille en collaboration avec modalContext
 * - modalContext gère l'affichage/fermeture de la modale
 * - animalManagementContext gère les données et la logique métier
 *
 * FLUX D'UTILISATION (Édition) :
 * 1. Utilisateur clique sur "Modifier" sur un animal
 * 2. setEditingAnimal(animal) stocke l'animal
 * 3. openEditModal() ouvre la modale avec le formulaire pré-rempli
 * 4. L'utilisateur modifie les champs
 * 5. handleUpdateAnimal() envoie les modifications à l'API
 * 6. Mise à jour locale de l'état + notification
 * 7. Fermeture automatique de la modale
 *
 * FLUX D'UTILISATION (Suppression) :
 * 1. Utilisateur clique sur "Supprimer" sur un animal
 * 2. Confirmation avec window.confirm()
 * 3. Si confirmé : handleDeleteAnimal() envoie la requête DELETE
 * 4. Suppression locale de l'état + notification
 * 5. L'animal disparaît de la liste
 */
import React, { createContext, useContext, useState } from "react";
import type { Animal } from "../types/animal";
import type { AnimalForm } from "../types/form";
import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { AnimalService } from "../services/api/animalService";
import { useNotification } from "./NotificationContext";
import { useAuth } from "./authContext";
import formDataToObject from "./utils/formDataToObject";

// Configuration du client API
const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const animalService = new AnimalService(axios);

/**
 * INTERFACE DU CONTEXTE
 * Définit toutes les fonctions et données disponibles
 */
export interface AnimalManagementContextType {
  // État de la modale d'édition
  isEditModalOpen: boolean;
  editingAnimal: Animal | null;

  // Fonctions d'ouverture/fermeture
  openEditModal: (animal: Animal) => void;
  closeEditModal: () => void;

  // Fonctions CRUD
  handleUpdateAnimal: (
    event: React.FormEvent<HTMLFormElement>
  ) => Promise<void>;
  handleDeleteAnimal: (animalId: string, animalName: string) => Promise<void>;

  // Erreurs
  error: string | null;
  setError: (error: string | null) => void;
}

interface AnimalManagementProviderProps {
  children: React.ReactNode;
}

const AnimalManagementContext =
  createContext<AnimalManagementContextType | null>(null);

export default function AnimalManagementProvider({
  children,
}: AnimalManagementProviderProps) {
  /**
   * HOOKS ET ÉTATS
   */
  const { user, setUser } = useAuth(); // Pour mettre à jour la liste des animaux de l'utilisateur
  const { showSuccess, showError } = useNotification(); // Pour afficher les notifications

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * OUVRIR LA MODALE D'ÉDITION
   *
   * Stocke l'animal à éditer et ouvre la modale
   *
   * @param animal - L'animal à éditer
   */
  const openEditModal = (animal: Animal) => {
    setEditingAnimal(animal);
    setIsEditModalOpen(true);
    setError(null);
  };

  /**
   * FERMER LA MODALE D'ÉDITION
   *
   * Réinitialise l'état : ferme la modale et nettoie les données
   */
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAnimal(null);
    setError(null);
  };

  /**
   * METTRE À JOUR UN ANIMAL
   *
   * Processus complet de modification :
   * 1. Récupération des données du formulaire
   * 2. Extraction uniquement des champs modifiés
   * 3. Envoi à l'API PATCH /api/animals/:id
   * 4. Mise à jour de l'état local (user.association.animals)
   * 5. Notification de succès
   * 6. Fermeture de la modale
   *
   * OPTIMISATION : Mise à jour locale immédiate
   * - Pas besoin de recharger toute la page
   * - L'utilisateur voit le changement instantanément
   * - Meilleure expérience utilisateur
   *
   * @param event - Événement de soumission du formulaire
   */
  const handleUpdateAnimal = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editingAnimal) {
      showError("Erreur", "Aucun animal sélectionné pour modification", 3000);
      return;
    }

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    try {
      /**
       * EXTRACTION DES DONNÉES DU FORMULAIRE
       * On récupère tous les champs modifiables
       */
      const keys = [
        "name",
        "species",
        "breed",
        "age",
        "sex",
        "description",
        "photo_url",
        "status",
      ] as const;
      const rawData = formDataToObject<Record<string, string>>(formData, keys as any);

      // Construction des données avec conversion de l'âge
      const animalData: Partial<AnimalForm> = {
        name: rawData.name,
        species: rawData.species,
        breed: rawData.breed,
        age: parseInt(rawData.age || "0"),
        sex: rawData.sex,
        description: rawData.description,
        photo_url: rawData.photo_url,
      };

      /**
       * APPEL API : PATCH /api/animals/:id
       * Envoie uniquement les champs modifiés à l'API
       */
      const updatedAnimal = await animalService.updateAnimal(
        editingAnimal.id_animal,
        animalData
      );

      /**
       * MISE À JOUR LOCALE DE L'ÉTAT
       *
       * Pourquoi mettre à jour localement ?
       * - Évite un rechargement complet de la page
       * - Feedback instantané pour l'utilisateur
       * - Économise une requête API GET
       *
       * On parcourt la liste des animaux et on remplace celui modifié
       */
      if (user?.association?.animals) {
        const updatedAnimals = user.association.animals.map((animal) =>
          animal.id_animal === updatedAnimal.id_animal
            ? { ...animal, ...updatedAnimal }
            : animal
        );

        // Mise à jour de l'état global de l'utilisateur
        setUser({
          ...user,
          association: {
            ...user.association,
            animals: updatedAnimals,
          },
        });
      }

      /**
       * NOTIFICATION ET FERMETURE
       */
      showSuccess(
        "Animal modifié !",
        `${updatedAnimal.name} a été mis à jour avec succès.`,
        4000
      );

      closeEditModal();
    } catch (error) {
      /**
       * GESTION DES ERREURS
       * - Affiche l'erreur dans la modale
       * - Affiche une notification d'erreur
       * - La modale reste ouverte pour correction
       */
      if (error instanceof Error) {
        setError(error.message);
        showError("Erreur", error.message, 5000);
      } else {
        const errorMessage = "Une erreur est survenue lors de la modification";
        setError(errorMessage);
        showError("Erreur", errorMessage, 5000);
      }
    }
  };

  /**
   * SUPPRIMER UN ANIMAL
   *
   * Processus de suppression avec confirmation :
   * 1. Affichage d'une boîte de dialogue de confirmation
   * 2. Si confirmé : Envoi DELETE /api/animals/:id
   * 3. Suppression locale de l'animal
   * 4. Mise à jour de l'état (user.association.animals)
   * 5. Notification de succès
   *
   * ⚠️ SÉCURITÉ : Confirmation obligatoire
   * - window.confirm() empêche les suppressions accidentelles
   * - Pas de bouton "Annuler" une fois supprimé (action irréversible)
   *
   * AMÉLIORATION POSSIBLE :
   * - Remplacer window.confirm() par une modale personnalisée
   * - Ajouter un délai avant suppression définitive (corbeille)
   *
   * @param animalId - ID de l'animal à supprimer
   * @param animalName - Nom de l'animal (pour la confirmation et la notification)
   */
  const handleDeleteAnimal = async (animalId: string, animalName: string) => {
    /**
     * CONFIRMATION DE SUPPRESSION
     * Boîte de dialogue native du navigateur
     */
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${animalName} ? Cette action est irréversible.`
    );

    if (!confirmed) {
      return; // L'utilisateur a annulé
    }

    try {
      /**
       * APPEL API : DELETE /api/animals/:id
       * Suppression définitive en base de données
       */
      await animalService.deleteAnimal(animalId);

      /**
       * MISE À JOUR LOCALE DE L'ÉTAT
       *
       * On filtre l'animal supprimé de la liste
       * Résultat : l'animal disparaît immédiatement de l'interface
       */
      if (user?.association?.animals) {
        const updatedAnimals = user.association.animals.filter(
          (animal) => animal.id_animal !== animalId
        );

        // Mise à jour de l'état global de l'utilisateur
        setUser({
          ...user,
          association: {
            ...user.association,
            animals: updatedAnimals,
          },
        });
      }

      /**
       * NOTIFICATION DE SUCCÈS
       */
      showSuccess(
        "Animal supprimé",
        `${animalName} a été supprimé avec succès.`,
        4000
      );
    } catch (error) {
      /**
       * GESTION DES ERREURS
       * - Erreur 403 : Pas le propriétaire
       * - Erreur 404 : Animal non trouvé
       * - Autre : Erreur serveur
       */
      if (error instanceof Error) {
        showError("Erreur", error.message, 5000);
      } else {
        showError(
          "Erreur",
          "Une erreur est survenue lors de la suppression",
          5000
        );
      }
    }
  };

  /**
   * VALEURS DU CONTEXTE
   * Toutes les fonctions et données accessibles aux composants enfants
   */
  const contextValues: AnimalManagementContextType = {
    isEditModalOpen,
    editingAnimal,
    openEditModal,
    closeEditModal,
    handleUpdateAnimal,
    handleDeleteAnimal,
    error,
    setError,
  };

  return (
    <AnimalManagementContext.Provider value={contextValues}>
      {children}
    </AnimalManagementContext.Provider>
  );
}

/**
 * HOOK PERSONNALISÉ : useAnimalManagement
 *
 * Permet d'accéder facilement au contexte dans n'importe quel composant
 *
 * Usage dans un composant :
 * ```typescript
 * const { openEditModal, handleDeleteAnimal } = useAnimalManagement();
 * ```
 */
export function useAnimalManagement() {
  const context = useContext(AnimalManagementContext);

  if (!context) {
    throw new Error(
      "useAnimalManagement must be used within AnimalManagementProvider"
    );
  }

  return context;
}
