/**
 * COMPOSANT PROFIL GESTIONNAIRE D'ASSOCIATION
 * 
 * Interface spécialisée pour les gestionnaires d'association :
 * 
 * Champs éditables de l'association :
 * - Nom de l'association
 * - Email de contact
 * - Numéro de téléphone
 * - Adresse complète
 * 
 * Gestion des demandes reçues :
 * - Affichage de toutes les demandes pour les animaux de l'association
 * - Actions accepter/refuser directement depuis le profil
 * - Mise à jour en temps réel des statuts
 * 
 * Fonctionnalités avancées :
 * - Mapping intelligent des champs pour l'API
 * - Édition inline avec validation
 * - Gestion des relations complexes (association → animaux → demandes)
 * 
 * Workflow de gestion :
 * - Réception de demandes → notification
 * - Évaluation → acceptation/refus
 * - Mise à jour automatique des statuts
 */
import "./Profile.scss";

import type { AuthUser } from "../../types/user";
import type { AssociationUpdateForm } from "../../types/form";
import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { ProfileService } from "../../services/api/profileService";

import RoleField from "../../components/profile/RoleField";
import RequestCard from "../../components/RequestCard/RequestCard";
import formDataToObject from "../../contexts/utils/formDataToObject";
import EditableAssociationField from "../../components/profile/EditableField/EditableAssociationField";
import { useModal } from "../../contexts/modalContext";
import { useAnimalManagement } from "../../contexts/animalManagementContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const profileService = new ProfileService(axios);

interface AssociationProfileProps {
  userData: AuthUser | null;
  setUserData: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  item: string | null;
  setItem: React.Dispatch<React.SetStateAction<string | null>>;
  handleEdit: (field: string) => void;
  handleCancel: () => void;
}

export default function AssociationProfile({
  userData,
  setUserData,
  item,
  setItem,
  handleEdit,
  handleCancel,
}: AssociationProfileProps) {
  /**
   * CONTEXTES NÉCESSAIRES
   * - useModal : Pour ouvrir la modale de création d'animal
   * - useAnimalManagement : Pour gérer modification et suppression
   */
  const { openModal } = useModal();
  const { openEditModal, handleDeleteAnimal } = useAnimalManagement();

  const mapFieldToApiKey = (field: string, nestedField?: string): string => {
    if (field === "association" && nestedField === "name") {
      return "id_association";
    }
    return nestedField ?? field;
  };

  const handleCheck = async (
    event: React.FormEvent<HTMLFormElement>,
    field: string,
    nestedField?: string,
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!userData) {
      throw new Error("User should never be null on profile page");
    }

    if (!userData.association) {
      throw new Error("User should never be null on association profile page");
    }

    if (!item) return; // aucun champ sélectionné à modifier

    try {
      // On traduit le champ sélectionné en clé API correcte
      const apiKey = mapFieldToApiKey(field, nestedField);

      // On récupère les valeurs du formulaire uniquement pour cette clé
      const keys: (keyof AssociationUpdateForm)[] = [
        apiKey as keyof AssociationUpdateForm,
      ];

      const id_association: string = userData.association.id_association;
      const id_user: string = userData.id_user;
      const data: AssociationUpdateForm = {
        ...formDataToObject<Partial<AssociationUpdateForm>>(formData, keys),
        id_association: id_association,
        id_user: id_user,
      };

      const response = await profileService.updateAssociation(
        data,
        id_association,
      );

      setUserData({
        ...userData,
        ...response,
        association: {
          ...userData.association,
          ...response.association,
        },
      });
      setItem(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {userData && userData.association ? (
        <article className="profile">
          <RoleField />

          <EditableAssociationField
            association={userData.association}
            field="name"
            label="Nom"
            type="text"
            isEditing={item === "name"}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleCheck={handleCheck}
          />

          <EditableAssociationField
            association={userData.association}
            field="email"
            label="Email"
            type="email"
            isEditing={item === "email"}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleCheck={handleCheck}
          />

          <EditableAssociationField
            association={userData.association}
            field="phone"
            label="Téléphone"
            type="text"
            isEditing={item === "phone"}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleCheck={handleCheck}
          />

          <EditableAssociationField
            association={userData.association}
            field="address"
            label="Adresse"
            type="text"
            isEditing={item === "address"}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleCheck={handleCheck}
          />

          {/**
           * SECTION : GESTION DES ANIMAUX
           *
           * Cette section permet aux associations de :
           * 1. Voir la liste de leurs animaux
           * 2. Ajouter un nouvel animal
           * 3. Modifier un animal existant (bouton crayon)
           * 4. Supprimer un animal (bouton poubelle)
           *
           * ARCHITECTURE :
           * - Bouton "+ Ajouter" : Ouvre modale de création (useModal)
           * - Bouton "Modifier" : Ouvre modale d'édition (useAnimalManagement)
           * - Bouton "Supprimer" : Confirmation puis suppression (useAnimalManagement)
           */}
          <div className="profile_containers">
            <div className="profile_containers_identity">
              <div className="field_info">
                <span className="field_label">Gestion des animaux</span>
                <span className="field_value">
                  Créer et gérer les animaux de votre association
                </span>
              </div>
              {/**
               * BOUTON : AJOUTER UN ANIMAL
               *
               * Ouvre la modale de création (AnimalForm)
               * Gérée par useModal() car c'est une création (formulaire vide)
               */}
              <button
                type="button"
                className="edit_button"
                onClick={() => openModal("animal")}
              >
                + Ajouter un animal
              </button>
            </div>
          </div>

          {/**
           * LISTE DES ANIMAUX DE L'ASSOCIATION
           *
           * Affiche tous les animaux avec :
           * - Photo + nom
           * - Informations principales (espèce, race, âge, sexe, statut)
           * - Bouton Modifier (icône crayon)
           * - Bouton Supprimer (icône poubelle)
           *
           * Chaque animal est affiché dans une carte avec actions
           */}
          {userData.association.animals && userData.association.animals.length > 0 ? (
            <div className="profile_containers">
              <h3 className="field_label" style={{ marginBottom: '1rem' }}>Mes animaux ({userData.association.animals.length})</h3>
              <div className="animals_grid">
                {userData.association.animals.map((animal) => (
                  <div key={animal.id_animal} className="animal_management_card">
                    {/**
                     * IMAGE DE L'ANIMAL
                     * Photo de profil avec fallback si URL cassée
                     */}
                    <div className="animal_management_card_image">
                      <img
                        src={animal.photo_url}
                        alt={animal.name}
                        onError={(e) => {
                          // Fallback si l'image ne charge pas
                          e.currentTarget.src = '/404.webp';
                        }}
                      />
                      {/**
                       * BADGE DE STATUT
                       * Indique si l'animal est disponible ou accueilli
                       * Classe CSS dynamique selon le statut
                       */}
                      <span className={`status status--${animal.status}`}>
                        {animal.status}
                      </span>
                    </div>

                    {/**
                     * INFORMATIONS DE L'ANIMAL
                     * Affichage organisé des données principales
                     */}
                    <div className="animal_management_card_content">
                      <h4>{animal.name}</h4>

                      {/**
                       * GRILLE D'INFORMATIONS
                       * Layout en 2 colonnes pour compacité
                       */}
                      <div className="animal_management_card_info">
                        <div className="info_row">
                          <span className="info_label">Espèce:</span>
                          <span className="info_value">{animal.species}</span>
                        </div>
                        <div className="info_row">
                          <span className="info_label">Race:</span>
                          <span className="info_value">{animal.breed}</span>
                        </div>
                        <div className="info_row">
                          <span className="info_label">Âge:</span>
                          <span className="info_value">{animal.age} an{animal.age > 1 ? 's' : ''}</span>
                        </div>
                        <div className="info_row">
                          <span className="info_label">Sexe:</span>
                          <span className="info_value">{animal.sex}</span>
                        </div>
                      </div>

                      {/**
                       * BOUTONS D'ACTION
                       *
                       * Layout horizontal avec icônes FontAwesome
                       * Couleurs différenciées : vert (modifier) / rouge (supprimer)
                       */}
                      <div className="animal_management_card_actions">
                        {/**
                         * BOUTON MODIFIER
                         *
                         * Comportement :
                         * 1. Appelle openEditModal(animal)
                         * 2. Stocke l'animal dans le contexte animalManagement
                         * 3. Ouvre la modale avec EditAnimalForm
                         * 4. Le formulaire est pré-rempli avec les données de l'animal
                         *
                         * Icône : Crayon (faPencil)
                         * Couleur : Vert (#3bb188)
                         */}
                        <button
                          type="button"
                          className="action_button action_button--edit"
                          onClick={() => openEditModal(animal)}
                          aria-label={`Modifier ${animal.name}`}
                          title="Modifier cet animal"
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </button>

                        {/**
                         * BOUTON SUPPRIMER
                         *
                         * Comportement :
                         * 1. Appelle handleDeleteAnimal(id, nom)
                         * 2. Affiche une confirmation window.confirm()
                         * 3. Si confirmé : Envoie DELETE /api/animals/:id
                         * 4. Supprime l'animal de l'état local
                         * 5. L'animal disparaît immédiatement de la liste
                         *
                         * Sécurité :
                         * - Confirmation obligatoire
                         * - Backend vérifie que l'animal appartient à l'association
                         * - Action irréversible
                         *
                         * Icône : Poubelle (faTrash)
                         * Couleur : Rouge (#dc3545)
                         */}
                        <button
                          type="button"
                          className="action_button action_button--delete"
                          onClick={() => handleDeleteAnimal(animal.id_animal, animal.name)}
                          aria-label={`Supprimer ${animal.name}`}
                          title="Supprimer cet animal"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /**
             * MESSAGE SI AUCUN ANIMAL
             * Encourage l'association à ajouter son premier animal
             */
            <div className="profile_containers">
              <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                Aucun animal pour le moment. Cliquez sur "+ Ajouter un animal" pour commencer.
              </p>
            </div>
          )}

          {userData.association.animals?.length ? (
            <div className="profile_containers requests">
              <ul className="requests_list">
                {userData.association.animals.map((animal) =>
                  animal.requests.map((request) => (
                    <li
                      key={request?.id_request}
                      className="requests_list_item"
                    >
                      <RequestCard
                        request={request}
                        userData={userData}
                        setUserData={setUserData}
                      />
                    </li>
                  )),
                )}
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