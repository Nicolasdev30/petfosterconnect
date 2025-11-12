/**
 * FORMULAIRE DE CRÉATION D'ANIMAL
 * 
 * Interface pour les associations pour ajouter des animaux :
 * 
 * Champs obligatoires :
 * - Nom : Identité de l'animal
 * - Espèce : Type d'animal (Chien, Chat, etc.)
 * - Race : Race spécifique
 * - Âge : En années (validation numérique)
 * - Sexe : Dropdown Mâle/Femelle
 * - Description : Présentation détaillée (textarea)
 * - Photo : URL de l'image
 * 
 * Fonctionnalités :
 * - Validation HTML5 intégrée
 * - Textarea redimensionnable pour description
 * - Dropdown stylisé pour le sexe
 * - Gestion d'erreurs avec feedback
 * 
 * Restrictions :
 * - Accessible uniquement aux associations
 * - Rattachement automatique à l'association de l'utilisateur
 * - Statut "disponible" par défaut
 */
import "./forms.scss";

interface AnimalFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
}

export default function AnimalForm({ handleSubmit, error }: AnimalFormProps) {
  return (
    <div className="form_modal">
      <h3 className="form_modal_title">Nouvel animal</h3>
      <form onSubmit={handleSubmit} className="form_modal_form" role="form">
        <label htmlFor="name" className="form_modal_form_label">
          <span>Nom:</span>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="Nom"
            className="form_modal_form_label_input"
          />
        </label>

        <label htmlFor="species" className="form_modal_form_label">
          <span>Espèce:</span>
          <input
            type="text"
            name="species"
            id="species"
            required
            placeholder="Espèce"
            className="form_modal_form_label_input"
          />
        </label>

        <label htmlFor="breed" className="form_modal_form_label">
          <span>Race:</span>
          <input
            type="text"
            name="breed"
            id="breed"
            required
            placeholder="Race"
            className="form_modal_form_label_input"
          />
        </label>

        <label htmlFor="age" className="form_modal_form_label">
          <span>Age:</span>
          <input
            type="number"
            name="age"
            id="age"
            required
            placeholder="Age"
            className="form_modal_form_label_input"
          />
        </label>

        <label htmlFor="sex" className="form_modal_form_label">
          <span>Sexe:</span>
          <select
            name="sex"
            id="sex"
            required
            className="form_modal_form_label_input"
          >
            <option value="">Sélectionner le sexe</option>
            <option value="Mâle">Mâle</option>
            <option value="Femelle">Femelle</option>
          </select>
        </label>

        <label htmlFor="description" className="form_modal_form_label">
          <span>Description:</span>
          <textarea
            name="description"
            id="description"
            required
            placeholder="Description de l'animal"
            className="form_modal_form_label_input"
            rows={4}
          />
        </label>

        <label htmlFor="photo_url" className="form_modal_form_label">
          <span>Photo:</span>
          <input
            type="text"
            name="photo_url"
            id="photo_url"
            required
            placeholder="Url"
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