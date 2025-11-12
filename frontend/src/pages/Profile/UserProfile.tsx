/**
 * COMPOSANT PROFIL FAMILLE D'ACCUEIL
 * 
 * Interface spécialisée pour les familles d'accueil :
 * 
 * Champs éditables :
 * - Informations personnelles : prénom, nom, email
 * - Mot de passe : Modification sécurisée
 * - Rôle : Affichage avec possibilité de basculement
 * 
 * Actions contextuelles :
 * - Création d'animal (si mode association)
 * - Création d'association (si pas encore rattaché)
 * - Gestion des demandes d'accueil
 * 
 * Fonctionnalités :
 * - Édition inline des champs avec validation
 * - Historique des demandes avec statuts
 * - Boutons d'action selon le contexte utilisateur
 * 
 * Workflow :
 * - Clic édition → formulaire inline
 * - Validation → mise à jour API
 * - Succès → mise à jour état local
 * - Erreur → affichage message d'erreur
 */
import "./Profile.scss";

import type { AuthUser } from "../../types/user";
import type { UserUpdateForm } from "../../types/form";

import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { ProfileService } from "../../services/api/profileService";

import RoleField from "../../components/profile/RoleField";
import RequestCard from "../../components/RequestCard/RequestCard";
import EditableProfileField from "../../components/profile/EditableField/EditableProfileField";
import formDataToObject from "../../contexts/utils/formDataToObject";
import { useModal } from "../../contexts/modalContext";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const profileService = new ProfileService(axios);

interface UserProfileProps {
  userData: AuthUser | null;
  setUserData: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  item: string | null;
  setItem: React.Dispatch<React.SetStateAction<string | null>>;
  handleEdit: (field: string) => void;
  handleCancel: () => void;
}

export default function UserProfile({
  userData,
  setUserData,
  item,
  setItem,
  handleEdit,
  handleCancel,
}: UserProfileProps) {
  const { openModal } = useModal();

  const handleCheck = async (
    event: React.FormEvent<HTMLFormElement>,
    inputName: string,
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!userData) {
      throw new Error("User should never be null on Profile page");
    }

    if (!item) return; // aucun champ sélectionné à modifier

    try {
      const keys: (keyof UserUpdateForm)[] = [inputName as keyof UserUpdateForm];

      const data: UserUpdateForm = {
        ...formDataToObject<UserUpdateForm>(formData, keys),
        id_user: userData.id_user,
      };

      const response = await profileService.updateUser(data);

      setUserData({
        ...userData,
        ...response,
      });
      setItem(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {userData ? (
        <article className="profile">
          <EditableProfileField
            user={userData}
            field="first_name"
            label="Prénom"
            type="text"
            isEditing={item === "first_name"}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleCheck={handleCheck}
          />

          <EditableProfileField
            user={userData}
            field="last_name"
            label="Nom"
            type="text"
            isEditing={item === "last_name"}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleCheck={handleCheck}
          />

          <RoleField />

          <EditableProfileField
            user={userData}
            field="email"
            label="Email"
            type="email"
            isEditing={item === "email"}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleCheck={handleCheck}
          />

          <EditableProfileField
            user={userData}
            field="password"
            label="Password"
            type="password"
            isEditing={item === "password"}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleCheck={handleCheck}
          />

          {/* + AJOUTÉ : Bouton pour créer une association si l'utilisateur n'en a pas */}
          {userData?.role.label === "utilisateur" && !userData?.association && (
            <div className="profile_containers">
              <div className="profile_containers_identity">
                <div className="field_info">
                  <span className="field_label">Créer une association</span>
                  <span className="field_value">
                    Vous pouvez créer votre propre association
                  </span>
                </div>
                <button
                  type="button"
                  className="edit_button"
                  onClick={() => openModal("association")}
                >
                  + Créer une association
                </button>
              </div>
            </div>
          )}

          {userData.requests?.length ? (
            <div className="profile_containers requests">
              <ul className="animals_list">
                {userData?.requests?.map((request) => (
                  <li key={request.id_request} className="requests_list_item">
                    <RequestCard
                      request={request}
                      userData={userData}
                      setUserData={setUserData}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="profile_containers requests">
              <p>Demandes: Aucune demande</p>
            </div>
          )}
        </article>
      ) : (
        <p>Chargement</p>
      )}
    </>
  );
}