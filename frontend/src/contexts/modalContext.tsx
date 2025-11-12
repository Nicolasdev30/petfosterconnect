/**
 * CONTEXTE DE GESTION DES MODALES
 * 
 * Centralise la gestion de toutes les modales de l'application :
 * - Modal de connexion (login)
 * - Modal d'inscription (register)
 * - Modal de création d'animal (animal)
 * - Modal de création d'association (association)
 * 
 * Fonctionnalités :
 * - Ouverture/fermeture des modales
 * - Gestion des formulaires avec validation
 * - Traitement des erreurs avec notifications
 * - Nettoyage automatique des données de formulaire
 */
import React, { createContext, useContext, useState } from "react";

import type { 
  UserRegisterForm, 
  UserLoginForm, 
  AnimalForm, 
  AssociationForm 
} from "../types/form";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { AuthService } from "../services/api/authService";
import { AnimalService } from "../services/api/animalService";
import { AssociationService } from "../services/api/associationService";
import { useAuth } from "./authContext";
import { useNotification } from "./NotificationContext";
import formDataToObject from "./utils/formDataToObject";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const authService = new AuthService(axios);
const animalService = new AnimalService(axios);
const associationService = new AssociationService(axios);

export interface ModalContextType {
  isOpen: boolean;
  modalType: string | null;
  formData: FormData;
  resetForm: React.Dispatch<React.SetStateAction<FormData>>;
  error: string | null;
  setError: (message: string | null) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  openModal: (type: string) => void;
  closeModal: () => void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

const ModalContext = createContext<ModalContextType | null>(null);

export default function ModalProvider({ children }: ModalProviderProps) {
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    try {
      if (modalType === "register") {
        const keys: (keyof UserRegisterForm)[] = [
          "first_name",
          "last_name",
          "email",
          "password",
          "confirmPassword",
        ];
        const data = formDataToObject<UserRegisterForm>(formData, keys);
        await authService.register(data);

        showSuccess(
          "Inscription réussie !",
          "Votre compte a été créé avec succès. Veuillez vous connecter maintenant.",
          6000
        );
      }

      if (modalType === "login") {
        const keys: (keyof UserLoginForm)[] = ["email", "password"];
        const data = formDataToObject<UserLoginForm>(formData, keys);
        const response = await authService.login(data);

        const authUser = { ...response, password: "" };
        setUser(authUser);

        showSuccess(
          "Connexion réussie !",
          `Bonjour ${response.first_name} ! Vous êtes maintenant connecté(e).`,
          4000
        );
      }

      if (modalType === "animal") {
        if (!user?.association) {
          throw new Error("Vous devez être rattaché à une association pour créer un animal");
        }

        const keys = [
          "name",
          "species",
          "breed",
          "age",
          "sex",
          "description",
          "photo_url"
        ] as const;
        const rawData = formDataToObject<Record<string, string>>(formData, keys as any);

        const animalData: AnimalForm = {
          ...rawData,
          age: parseInt(rawData.age || "0")
        } as AnimalForm;
        
        await animalService.createAnimal(animalData);

        showSuccess(
          "Animal créé !",
          `${animalData.name} a été ajouté avec succès à votre association.`,
          4000
        );
      }

      if (modalType === "association") {
        const keys: (keyof AssociationForm)[] = [
          "name",
          "email",
          "street",
          "city", 
          "postalCode",
          "phone"
        ];
        const associationData = formDataToObject<AssociationForm>(formData, keys);
        
        const address = `${associationData.street}, ${associationData.postalCode} ${associationData.city}`;
        
        const finalData = {
          name: associationData.name,
          email: associationData.email,
          phone: associationData.phone,
          address: address
        };
        
        const response = await associationService.createAssociation(finalData);
        
        setUser(response.user);

        showSuccess(
          "Association créée !",
          `L'association ${associationData.name} a été créée avec succès.`,
          4000
        );
      }

      setError(null);
      closeModal();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        showError("Erreur", error.message, 5000);
      } else {
        const errorMessage = "Une erreur est survenue";
        setError(errorMessage);
        showError("Erreur", errorMessage, 5000);
      }
    }
  }

  const resetForm = () => setFormData(new FormData());

  const openModal = (type: string) => {
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
    setError(null);
    setFormData(new FormData());
  };

  const contextValues: ModalContextType = {
    isOpen,
    modalType,
    formData,
    resetForm,
    error,
    setError,
    handleSubmit,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={contextValues}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used in modalProvider");
  }

  return context;
}