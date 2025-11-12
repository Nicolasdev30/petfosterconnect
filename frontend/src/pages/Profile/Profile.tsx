/**
 * PAGE PROFIL UTILISATEUR
 * 
 * Interface de gestion du profil selon le rôle :
 * 
 * Fonctionnalités communes :
 * - Vérification de l'authentification
 * - Chargement du profil complet avec relations
 * - Gestion des erreurs avec fallback
 * 
 * Affichage conditionnel :
 * - UserProfile : Pour les familles d'accueil
 * - AssociationProfile : Pour les gestionnaires d'association
 * 
 * Gestion d'état :
 * - userData : Profil complet de l'utilisateur
 * - item : Champ actuellement en cours d'édition
 * - Fonctions de gestion de l'édition (edit, cancel)
 * 
 * Sécurité :
 * - Redirection si non connecté
 * - Chargement sécurisé des données
 * - Validation des permissions d'accès
 */
import "./Profile.scss";

import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Config } from "../../config/config";
import { useAuth } from "../../contexts/authContext";
import { ApiClient } from "../../services/client";
import { ProfileService } from "../../services/api/profileService";

import UserProfile from "./UserProfile";
import AssociationProfile from "./AssociationProfile";
import type { AuthUser } from "../../types/user";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const profileService = new ProfileService(axios);

export default function Profile() {
  const { user } = useAuth();
  const [item, setItem] = useState<string | null>(null);
  const [userData, setUserData] = useState<AuthUser | null>(null);

  const handleEdit = (field: string) => {
    setItem(field);
  };

  const handleCancel = () => {
    setItem(null);
  };

  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;
      try {
        const profilData = await profileService.getProfile(user.id_user);
        console.log("getProfile useEffect" + profilData);
        setUserData(profilData);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else if (error instanceof Error) {
          console.error("General error:", error.message);
        }
      }
    };

    getProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="profile">
        <div className="profile_container">
          <p>Vous devez être connecté pour accéder à votre profil.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <div className="profile">
          <div className="profile_container">
            {user.role.label === "association" ? (
              <AssociationProfile
                userData={userData}
                setUserData={setUserData}
                item={item}
                setItem={setItem}
                handleEdit={handleEdit}
                handleCancel={handleCancel}
              />
            ) : (
              <UserProfile
                userData={userData}
                setUserData={setUserData}
                item={item}
                setItem={setItem}
                handleEdit={handleEdit}
                handleCancel={handleCancel}
              />
            )}
          </div>
        </div>
      ) : (
        <p>Chargment</p>
      )}
    </>
  );
}
