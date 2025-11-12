/**
 * GESTIONNAIRE CENTRALISÉ DES MODALES
 *
 * Composant qui gère l'affichage de toutes les modales :
 *
 * Types de modales supportées :
 * - "register" : Formulaire d'inscription
 * - "login" : Formulaire de connexion
 * - "animal" : Création d'animal (associations)
 * - "association" : Création d'association
 * - Modale d'édition d'animal (gérée par AnimalManagementContext)
 *
 * ARCHITECTURE À DOUBLE MODALE :
 * 1. Modales génériques (création) : Gérées par ModalContext
 * 2. Modale d'édition d'animal : Gérée par AnimalManagementContext
 *
 * Pourquoi 2 systèmes de modales ?
 * - ModalContext : Modales génériques sans données pré-remplies
 * - AnimalManagementContext : Modale spécifique avec animal sélectionné
 *
 * Fonctionnalités :
 * - Overlay avec fermeture au clic extérieur
 * - Bouton de fermeture avec icône
 * - Gestion des erreurs avec affichage
 * - Soumission de formulaires centralisée
 *
 * UX/UI :
 * - Animations d'ouverture/fermeture
 * - Backdrop blur pour focus
 * - Responsive design mobile-friendly
 * - Accessibilité (role="dialog", aria-label)
 */
import "./ModalsManager.scss";

import type { FormEvent } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useModal } from "../../contexts/modalContext";
import { useAnimalManagement } from "../../contexts/animalManagementContext";
import RegisterForm from "./forms/RegisterForm";
import LoginForm from "./forms/LoginForm";
import AnimalForm from "./forms/AnimalForm";
import EditAnimalForm from "./forms/EditAnimalForm";
import AssociationForm from "./forms/AssociationForm";

export default function ModalsManager() {
  /**
   * CONTEXTES UTILISÉS
   * - useModal : Modales génériques (connexion, inscription, création)
   * - useAnimalManagement : Modale d'édition d'animal avec données pré-remplies
   */
  const { isOpen, modalType, error, handleSubmit, closeModal } = useModal();
  const {
    isEditModalOpen,
    editingAnimal,
    handleUpdateAnimal,
    closeEditModal,
    error: editError,
  } = useAnimalManagement();

  /**
   * AFFICHAGE CONDITIONNEL
   * Affiche soit la modale générique, soit la modale d'édition
   */
  const showGenericModal = isOpen;
  const showEditModal = isEditModalOpen;

  if (!showGenericModal && !showEditModal) return null;

  return (
    <>
      {/**
       * MODALE GÉNÉRIQUE
       * Pour connexion, inscription, création d'animal/association
       */}
      {showGenericModal && (
        <div className="modal" onClick={closeModal} role="dialog">
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              aria-label="Close modal"
              className="modal_content_close"
              onClick={closeModal}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="modal_content_form">
              {modalType === "register" && (
                <RegisterForm
                  handleSubmit={(event: FormEvent<HTMLFormElement>) =>
                    handleSubmit(event)
                  }
                  error={error}
                />
              )}

              {modalType === "login" && (
                <LoginForm
                  handleSubmit={(event: FormEvent<HTMLFormElement>) =>
                    handleSubmit(event)
                  }
                  error={error}
                />
              )}

              {modalType === "animal" && (
                <AnimalForm
                  handleSubmit={(event: FormEvent<HTMLFormElement>) =>
                    handleSubmit(event)
                  }
                  error={error}
                />
              )}

              {modalType === "association" && (
                <AssociationForm
                  handleSubmit={(event: FormEvent<HTMLFormElement>) =>
                    handleSubmit(event)
                  }
                  error={error}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/**
       * MODALE D'ÉDITION D'ANIMAL
       * Gérée séparément car elle a besoin de l'animal sélectionné
       * Formulaire pré-rempli avec les données existantes
       */}
      {showEditModal && editingAnimal && (
        <div className="modal" onClick={closeEditModal} role="dialog">
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              aria-label="Close modal"
              className="modal_content_close"
              onClick={closeEditModal}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="modal_content_form">
              <EditAnimalForm
                animal={editingAnimal}
                handleSubmit={handleUpdateAnimal}
                error={editError}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
