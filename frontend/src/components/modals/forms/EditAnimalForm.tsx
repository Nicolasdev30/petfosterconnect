/**
 * FORMULAIRE D'ÉDITION D'ANIMAL
 *
 * Interface pour modifier un animal existant.
 *
 * DIFFÉRENCES AVEC AnimalForm (création) :
 * - Champs pré-remplis avec les données de l'animal
 * - Attribut defaultValue sur chaque input
 * - Champ "Statut" ajouté (disponible/accueilli)
 * - Bouton "Modifier" au lieu de "Créer"
 * - Gestion via AnimalManagementContext au lieu de ModalContext
 *
 * FLUX D'UTILISATION :
 * 1. Utilisateur clique sur bouton "Modifier" (crayon) sur un animal
 * 2. openEditModal(animal) stocke l'animal dans le contexte
 * 3. Cette modale s'ouvre avec formulaire pré-rempli
 * 4. L'utilisateur modifie les champs nécessaires
 * 5. Soumission → handleUpdateAnimal() dans le contexte
 * 6. Appel API PATCH /api/animals/:id
 * 7. Mise à jour locale + notification + fermeture
 *
 * SÉCURITÉ :
 * - Le backend vérifie que l'animal appartient à l'association
 * - JWT token requis dans l'en-tête Authorization
 * - Validation des données côté serveur
 *
 * Champs modifiables :
 * - Nom : Identité de l'animal
 * - Espèce : Type d'animal (Chien, Chat, etc.)
 * - Race : Race spécifique
 * - Âge : En années (validation numérique)
 * - Sexe : Dropdown Mâle/Femelle
 * - Description : Présentation détaillée (textarea)
 * - Photo : URL de l'image
 * - Statut : disponible/accueilli (nouveau champ)
 *
 * Fonctionnalités :
 * - Validation HTML5 intégrée
 * - Textarea redimensionnable pour description
 * - Dropdown stylisé pour le sexe et le statut
 * - Gestion d'erreurs avec feedback visuel
 */
import "./forms.scss";
import type { Animal } from "../../../types/animal";

interface EditAnimalFormProps {
  animal: Animal;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
}

export default function EditAnimalForm({
  animal,
  handleSubmit,
  error,
}: EditAnimalFormProps) {
  return (
    <div className="form_modal">
      <h3 className="form_modal_title">Modifier {animal.name}</h3>

      {/**
       * FORMULAIRE D'ÉDITION
       *
       * Tous les champs utilisent defaultValue pour pré-remplir
       * avec les données existantes de l'animal
       *
       * IMPORTANT : defaultValue et non value
       * - value = controlled component (nécessite useState)
       * - defaultValue = uncontrolled component (plus simple ici)
       */}
      <form onSubmit={handleSubmit} className="form_modal_form" role="form">
        {/**
         * CHAMP : NOM
         * Pré-rempli avec animal.name
         */}
        <label htmlFor="name" className="form_modal_form_label">
          <span>Nom:</span>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="Nom"
            defaultValue={animal.name}
            className="form_modal_form_label_input"
          />
        </label>

        {/**
         * CHAMP : ESPÈCE
         * Pré-rempli avec animal.species (ex: "Chien", "Chat")
         */}
        <label htmlFor="species" className="form_modal_form_label">
          <span>Espèce:</span>
          <input
            type="text"
            name="species"
            id="species"
            required
            placeholder="Espèce"
            defaultValue={animal.species}
            className="form_modal_form_label_input"
          />
        </label>

        {/**
         * CHAMP : RACE
         * Pré-rempli avec animal.breed (ex: "Berger Allemand")
         */}
        <label htmlFor="breed" className="form_modal_form_label">
          <span>Race:</span>
          <input
            type="text"
            name="breed"
            id="breed"
            required
            placeholder="Race"
            defaultValue={animal.breed}
            className="form_modal_form_label_input"
          />
        </label>

        {/**
         * CHAMP : ÂGE
         * Type number pour validation automatique
         * Pré-rempli avec animal.age
         */}
        <label htmlFor="age" className="form_modal_form_label">
          <span>Âge:</span>
          <input
            type="number"
            name="age"
            id="age"
            required
            min="0"
            max="30"
            placeholder="Âge"
            defaultValue={animal.age}
            className="form_modal_form_label_input"
          />
        </label>

        {/**
         * CHAMP : SEXE
         * Dropdown avec 2 options : Mâle / Femelle
         * Pré-sélectionné avec animal.sex
         */}
        <label htmlFor="sex" className="form_modal_form_label">
          <span>Sexe:</span>
          <select
            name="sex"
            id="sex"
            required
            defaultValue={animal.sex}
            className="form_modal_form_label_input"
          >
            <option value="">Sélectionner le sexe</option>
            <option value="Mâle">Mâle</option>
            <option value="Femelle">Femelle</option>
          </select>
        </label>

        {/**
         * CHAMP : DESCRIPTION
         * Textarea pour texte long
         * Pré-rempli avec animal.description
         * rows={4} pour hauteur initiale confortable
         */}
        <label htmlFor="description" className="form_modal_form_label">
          <span>Description:</span>
          <textarea
            name="description"
            id="description"
            required
            placeholder="Description de l'animal"
            defaultValue={animal.description}
            className="form_modal_form_label_input"
            rows={4}
          />
        </label>

        {/**
         * CHAMP : PHOTO URL
         * URL de l'image de l'animal
         * Pré-rempli avec animal.photo_url
         *
         * AMÉLIORATION POSSIBLE :
         * - Upload de fichier avec prévisualisation
         * - Stockage dans un service cloud (AWS S3, Cloudinary)
         * - Compression automatique des images
         */}
        <label htmlFor="photo_url" className="form_modal_form_label">
          <span>Photo:</span>
          <input
            type="url"
            name="photo_url"
            id="photo_url"
            required
            placeholder="https://example.com/photo.jpg"
            defaultValue={animal.photo_url}
            className="form_modal_form_label_input"
          />
        </label>

        {/**
         * CHAMP : STATUT (NOUVEAU)
         *
         * Ce champ n'existe pas dans AnimalForm (création)
         * Car au moment de la création, le statut est toujours "disponible"
         *
         * Valeurs possibles :
         * - "disponible" : Animal cherche famille d'accueil
         * - "accueilli" : Animal déjà placé en famille
         *
         * Pré-sélectionné avec animal.status
         *
         * IMPACT :
         * - Change le badge de couleur sur la carte
         * - Filtre les animaux dans la recherche
         * - Empêche les nouvelles demandes si "accueilli"
         */}
        <label htmlFor="status" className="form_modal_form_label">
          <span>Statut:</span>
          <select
            name="status"
            id="status"
            required
            defaultValue={animal.status}
            className="form_modal_form_label_input"
          >
            <option value="disponible">Disponible</option>
            <option value="accueilli">Accueilli</option>
          </select>
        </label>

        {/**
         * BOUTON DE SOUMISSION
         *
         * Déclenche handleUpdateAnimal() du contexte
         * Envoie PATCH /api/animals/:id
         */}
        <button
          type="submit"
          aria-label="Update animal"
          className="form_modal_form_button button"
        >
          Modifier
        </button>
      </form>

      {/**
       * AFFICHAGE DES ERREURS
       *
       * Si une erreur survient (validation, réseau, permissions),
       * elle s'affiche ici en rouge sous le formulaire
       *
       * Exemples d'erreurs :
       * - "Vous n'avez pas l'autorisation de modifier cet animal"
       * - "Animal non trouvé"
       * - "Erreur de connexion au serveur"
       */}
      {error && <p className="form_modal_error">{error}</p>}
    </div>
  );
}
