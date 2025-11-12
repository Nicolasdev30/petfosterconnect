/**
 * COMPOSANT GESTION DES RÔLES UTILISATEUR
 * 
 * Interface de basculement entre rôles :
 * 
 * Affichage :
 * - Rôle actuel de l'utilisateur
 * - Boutons de basculement (si éligible)
 * 
 * Conditions d'éligibilité :
 * - Utilisateur doit être rattaché à une association
 * - Peut basculer entre "utilisateur" et "association"
 * - Les fosters purs ne peuvent pas devenir gestionnaires
 * 
 * Fonctionnalités :
 * - Validation côté client (évite basculement identique)
 * - Appel API pour changement de rôle
 * - Mise à jour automatique du contexte auth
 * - Gestion d'erreurs avec feedback
 * 
 * Workflow :
 * - Famille rejoint association → peut devenir gestionnaire
 * - Gestionnaire peut redevenir famille temporairement
 * - Changement de rôle → nouveau token JWT
 */
import "./EditableField/EditableField.scss";

import type { RoleSwitchForm } from "../../types/form";

import { useAuth } from "../../contexts/authContext";
import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { AuthService } from "../../services/api/authService";
import formDataToObject from "../../contexts/utils/formDataToObject";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const authService = new AuthService(axios);

export default function RoleField() {
  const { user, setUser } = useAuth();

  const handleSwitch = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const role = event.currentTarget.name;

    if (role === user?.role.label) {
      throw new Error("Le rôle choisi est identique à votre rôle actuel");
    }

    try {
      const formData = new FormData();
      formData.append("role", role);
      formData.append("id_user", user!.id_user);

      const keys: (keyof RoleSwitchForm)[] = ["role", "id_user"];
      const data = formDataToObject<RoleSwitchForm>(formData, keys);

      const response = await authService.switchRole(data);
      setUser(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="profile_containers">
      <div className="profile_containers_identity">
        <div className="field_info">
          <span className="field_label">Rôle</span>
          <span className="field_value">{user!.role.label}</span>
        </div>
        {user!.association ? (
          <div className="profile_containers_role_buttons">
            <button
              type="button"
              name="utilisateur"
              className="profile_containers_role_buttons_user button"
              onClick={(event) => {
                handleSwitch(event);
              }}
            >
              Utilisateur
            </button>
            <button
              type="button"
              name="association"
              className="profile_containers_role_buttons_association button"
              onClick={(event) => {
                handleSwitch(event);
              }}
            >
              Association
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
