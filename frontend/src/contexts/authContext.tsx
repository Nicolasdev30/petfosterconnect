/**
 * CONTEXTE D'AUTHENTIFICATION
 * 
 * Gère l'état global de l'authentification dans l'application :
 * - État de connexion de l'utilisateur
 * - Informations utilisateur (profil, rôle, association)
 * - Fonctions de connexion/déconnexion
 * 
 * Fonctionnalités :
 * - Vérification automatique de la session au chargement
 * - Gestion des erreurs d'authentification
 * - Déconnexion avec notification
 * - Persistance via cookies HttpOnly sécurisés
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import { isAxiosError } from "axios";

import type { AuthUser } from "../types/user";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { AuthService } from "../services/api/authService";
import { useNotification } from "./NotificationContext";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const authService = new AuthService(axios);

export interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const { showInfo } = useNotification();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.apiMe();
        setUser(response);
      } catch (error) {
        // Gestion silencieuse des erreurs d'authentification
        // Si l'utilisateur n'est pas connecté, c'est normal
        setUser(null);
      }
    };
    fetchUser();
  }, []);
 const logout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    // Gestion silencieuse - même si le backend échoue, on déconnecte côté client
    if (isAxiosError(error)) {
      console.error("Erreur lors de la déconnexion:", error.message);
    }
  } finally {
    // Dans tous les cas, on déconnecte l'utilisateur côté frontend
    setUser(null);
    showInfo("À bientôt !", "Vous avez été déconnecté(e) avec succès.", 3000);
  }
};

  const contextValues: AuthContextType = {
    user,
    setUser,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("authModal must be used in authProvider");
  }

  return context;
}
