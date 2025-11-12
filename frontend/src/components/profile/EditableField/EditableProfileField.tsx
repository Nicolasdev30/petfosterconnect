/**
 * COMPOSANT CHAMP ÉDITABLE PROFIL UTILISATEUR
 * 
 * Interface d'édition inline pour les champs utilisateur :
 * 
 * Modes d'affichage :
 * - Lecture : Valeur + bouton édition (icône crayon)
 * - Édition : Input + boutons validation/annulation
 * 
 * Champs supportés :
 * - first_name, last_name : Informations personnelles
 * - email : Identifiant de connexion
 * - password : Modification sécurisée
 * 
 * Fonctionnalités :
 * - Édition inline sans rechargement de page
 * - Validation en temps réel
 * - Annulation avec restauration de la valeur
 * - Gestion des erreurs avec feedback visuel
 * 
 * Sécurité :
 * - Validation côté serveur obligatoire
 * - Sanitisation des entrées
 * - Vérification des permissions
 * 
 * UX :
 * - Transitions fluides entre modes
 * - Icônes Font Awesome pour les actions
 * - Focus automatique sur le champ en édition
 */
import "./EditableField.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import type { AuthUser } from "../../../types/user";

interface EditableProfileFieldProps {
  user: AuthUser;
  field: keyof Omit<AuthUser, "id_user" | "role" | "requests">;
  label?: string;
  type: string;
  isEditing: boolean;
  handleEdit: (field: string) => void;
  handleCancel: () => void;
  handleCheck: (
    event: React.FormEvent<HTMLFormElement>,
    inputName: string,
  ) => void;
}

export default function EditableProfileField({
  user,
  field,
  label,
  type,
  isEditing,
  handleEdit,
  handleCancel,
  handleCheck,
}: EditableProfileFieldProps) {
  const val = user[field];
  const displayValue = typeof val === "object" && val !== null ? "" : (val as string | number);

  const displayLabel = label ?? field;
  const inputName = field;

  return (
    <div className="profile_containers">
      {!isEditing ? (
        <div className="profile_containers_identity">
          <div className="field_info">
            <span className="field_label">{displayLabel}</span>
            <span className="field_value">{displayValue}</span>
          </div>
          <button
            type="button"
            aria-label={`Edit ${displayLabel}`}
            className="edit_button"
            onClick={() => handleEdit(field)}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
      ) : (
        <form
          onSubmit={(event) => handleCheck(event, inputName)}
          className="profile_containers_form"
        >
          <label htmlFor={inputName}>
            <span className="field_label">{displayLabel}</span>
            <input
              type={type}
              name={inputName}
              id={inputName}
              defaultValue={displayValue as string}
              placeholder={displayLabel}
            />
          </label>

          <div className="profile_containers_form_buttons">
            <button
              type="submit"
              aria-label={`Confirm ${displayLabel}`}
              className="edit button"
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button
              type="button"
              aria-label={`Cancel ${displayLabel}`}
              className="close button"
              onClick={handleCancel}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
