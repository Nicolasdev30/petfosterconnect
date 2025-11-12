/**
 * COMPOSANT CHAMP ÉDITABLE ASSOCIATION
 * 
 * Interface d'édition pour les informations d'association :
 * 
 * Champs gérés :
 * - name : Nom de l'association
 * - email : Contact principal
 * - phone : Numéro de téléphone
 * - address : Adresse complète
 * 
 * Fonctionnalités :
 * - Édition inline avec validation
 * - Mapping automatique vers les clés API
 * - Gestion des champs imbriqués (association.field)
 * - Mise à jour optimiste de l'interface
 * 
 * Permissions :
 * - Accessible aux gestionnaires d'association uniquement
 * - Vérification de propriété côté serveur
 * - Validation des formats (email, téléphone)
 * 
 * Workflow :
 * - Clic édition → mode formulaire
 * - Saisie → validation temps réel
 * - Soumission → API + mise à jour locale
 * - Succès → retour mode lecture
 */
import "./EditableField.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import type { Association } from "../../../types/association";

interface EditableAssociationFieldProps {
  association: Association;
  field: keyof Omit<Association, "id_association">;
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

export default function EditableAssociationField({
  association,
  field,
  label,
  type,
  isEditing,
  handleEdit,
  handleCancel,
  handleCheck,
}: EditableAssociationFieldProps) {
  const displayValue = association[field] ?? "";
  const displayLabel = label ?? field;

  return (
    <div className="profile_containers">
      {!isEditing ? (
        <>
          <p>
            {displayLabel}: {displayValue}
          </p>
          <button
            type="button"
            aria-label={`Edit ${displayLabel}`}
            className={`${field}_edit button`}
            onClick={() => handleEdit(field)}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        </>
      ) : (
        <form
          onSubmit={(event) => handleCheck(event, field)}
          className="profile_containers_form"
        >
          <label htmlFor={field}>
            {displayLabel}:
            <input
              type={type}
              name={field}
              id={field}
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
