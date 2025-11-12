/**
 * FORMULAIRE DE CRÉATION D'ASSOCIATION
 * 
 * Interface pour créer une nouvelle association :
 * 
 * Champs obligatoires :
 * - Nom : Dénomination de l'association
 * - Email : Contact principal (unique)
 * - Adresse décomposée : rue, ville, code postal
 * - Téléphone : Contact téléphonique
 * 
 * Fonctionnalités :
 * - Validation des formats (email, téléphone français)
 * - Composition automatique de l'adresse complète
 * - Rattachement automatique de l'utilisateur créateur
 * - Changement de rôle vers "association"
 * 
 * Workflow :
 * - Utilisateur crée association
 * - Devient automatiquement gestionnaire
 * - Peut basculer entre rôles famille/association
 * - Peut gérer les animaux de l'association
 * 
 * Validation :
 * - Email unique vérifié en base
 * - Format téléphone français (0123456789)
 * - Adresse complète obligatoire
 */
import "./forms.scss";

interface AssociationFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
}

export default function AssociationForm({
  handleSubmit,
  error,
}: AssociationFormProps) {
  return (
    <div className="form_modal">
      <h3 className="form_modal_title">Nouvel association</h3>
      <form onSubmit={handleSubmit} className="form_modal_form" role="form">
        <label htmlFor="name" className="form_modal_form_label">
          <span>Nom:</span>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="Nom"
            className="animal_modal_form_label_input"
          />
        </label>

        <label htmlFor="email" className="animal_modal_form_label">
          <span>Email:</span>
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="Email"
            className="form_modal_form_label_input"
          />
        </label>

        <label htmlFor="street" className="form_modal_form_label">
          <span>Rue:</span>
          <input
            type="text"
            name="street"
            id="street"
            required
            placeholder="Rue"
            className="form_modal_form_label_input"
          />
        </label>

        <label htmlFor="city" className="form_modal_form_label">
          <span>Ville:</span>
          <input
            type="text"
            name="city"
            id="city"
            required
            placeholder="Ville"
            className="form_modal_form_label_input"
          />
        </label>

        <label htmlFor="postalCode" className="form_modal_form_label">
          <span>Code postal:</span>
          <input
            type="text"
            name="postalCode"
            id="postalCode"
            required
            placeholder="Code postal"
            className="form_modal_form_label_input"
          />
        </label>

        <label htmlFor="phone" className="form_modal_form_label">
          <span>Téléphone:</span>
          <input
            type="text"
            name="phone"
            id="phone"
            required
            placeholder="Téléphone"
            className="form_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aria-label="Create"
          className="form_modal_form_button button"
        >
          Créer
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}
