/**
 * PAGE GESTION DES ANIMAUX (ASSOCIATIONS)
 * 
 * Interface de gestion complète des animaux pour les associations :
 * 
 * Fonctionnalités :
 * - Liste de tous les animaux de l'association
 * - Création de nouveaux animaux
 * - Modification des animaux existants
 * - Changement de statut (disponible/accueilli)
 * - Suppression d'animaux
 * 
 * Permissions :
 * - Accessible uniquement aux associations
 * - Gestion des animaux de sa propre association uniquement
 * 
 * Interface :
 * - Grille responsive des animaux
 * - Boutons d'action sur chaque animal
 * - Modal de création intégrée
 * - Filtres par statut
 */
import "./AnimalsManagement.scss";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

import type { Animal } from "../../types/animal";
import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";
import { useAnimalManagement } from "../../contexts/animalManagementContext";
import { useNotification } from "../../contexts/NotificationContext";
import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { AnimalService } from "../../services/api/animalService";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const animalService = new AnimalService(axios);

export default function AnimalsManagement() {
  const { user } = useAuth();
  const { openEditModal } = useAnimalManagement();
  const { openModal } = useModal();
  const { showSuccess, showError } = useNotification();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filter, setFilter] = useState<string>("all");

  // Vérifier les permissions
  if (!user || user.role.label !== "association" || !user.association) {
    return (
      <main className="animals_management">
        <div className="access_denied">
          <h1>Accès refusé</h1>
          <p>Cette page est réservée aux gestionnaires d'association.</p>
        </div>
      </main>
    );
  }

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const animalsData = await animalService.getAnimals();
      // Filtrer pour ne garder que les animaux de cette association
      const myAnimals = animalsData.filter(
        animal => animal.id_association === user.association?.id_association
      );
      setAnimals(myAnimals);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Erreur lors du chargement des animaux:", error.message);
      }
    }
  };

  const handleStatusChange = async (animalId: string, newStatus: string) => {
    try {
      await animalService.updateAnimal(animalId, { status: newStatus });
      showSuccess("Statut modifié", `L'animal a été marqué comme ${newStatus}`);
      fetchAnimals(); // Recharger la liste
    } catch (error) {
      if (error instanceof Error) {
        showError("Erreur", error.message);
      } else {
        showError("Erreur", "Impossible de modifier le statut de l'animal");
      }
    }
  };

  const handleDeleteAnimal = async (animalId: string, animalName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${animalName} ? Cette action est irréversible.`)) {
      try {
        await animalService.deleteAnimal(animalId);
        showSuccess("Animal supprimé", `${animalName} a été supprimé avec succès`);
        fetchAnimals(); // Recharger la liste
      } catch (error) {
        if (error instanceof Error) {
          showError("Erreur", error.message);
        } else {
          showError("Erreur", "Impossible de supprimer l'animal");
        }
      }
    }
  };

  const filteredAnimals = animals.filter(animal => {
    if (filter === "all") return true;
    return animal.status === filter;
  });

  return (
    <main className="animals_management">
      <div className="animals_management_container">
        {/* Header avec titre et bouton d'ajout */}
        <header className="animals_management_header">
          <div className="header_content">
            <h1>Gestion des animaux</h1>
            <p>Association : {user.association.name}</p>
          </div>
          <button
            type="button"
            className="add_animal_button"
            onClick={() => openModal("animal")}
          >
            <FontAwesomeIcon icon={faPlus} />
            Ajouter un animal
          </button>
        </header>

        {/* Filtres par statut */}
        <div className="animals_management_filters">
          <button
            type="button"
            className={`filter_button ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Tous ({animals.length})
          </button>
          <button
            type="button"
            className={`filter_button ${filter === "disponible" ? "active" : ""}`}
            onClick={() => setFilter("disponible")}
          >
            Disponibles ({animals.filter(a => a.status === "disponible").length})
          </button>
          <button
            type="button"
            className={`filter_button ${filter === "accueilli" ? "active" : ""}`}
            onClick={() => setFilter("accueilli")}
          >
            Accueillis ({animals.filter(a => a.status === "accueilli").length})
          </button>
        </div>

        {/* Liste des animaux */}
        {filteredAnimals.length > 0 ? (
          <div className="animals_grid">
            {filteredAnimals.map((animal) => (
              <article key={animal.id_animal} className="animal_management_card">
                <div className="animal_card_image">
                  <img
                    src={animal.photo_url}
                    alt={animal.name}
                    className="animal_image"
                  />
                  <span className={`status_badge status_badge--${animal.status}`}>
                    {animal.status}
                  </span>
                </div>

                <div className="animal_card_content">
                  <h3 className="animal_name">{animal.name}</h3>
                  
                  <div className="animal_info">
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
                      <span className="info_value">{animal.age} an{animal.age > 1 ? "s" : ""}</span>
                    </div>
                    <div className="info_row">
                      <span className="info_label">Sexe:</span>
                      <span className="info_value">{animal.sex}</span>
                    </div>
                  </div>

                  <div className="animal_actions">
                    <select
                      value={animal.status}
                      onChange={(e) => handleStatusChange(animal.id_animal, e.target.value)}
                      className="status_select"
                    >
                      <option value="disponible">Disponible</option>
                      <option value="accueilli">Accueilli</option>
                    </select>
                    
                    <div className="action_buttons">
                      <button
                        type="button"
                        className="edit_button"
                        title="Modifier l'animal"
                        onClick={() => openEditModal(animal)}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        type="button"
                        className="delete_button"
                        title="Supprimer l'animal"
                        onClick={() => handleDeleteAnimal(animal.id_animal, animal.name)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no_animals">
            <h3>Aucun animal trouvé</h3>
            <p>
              {filter === "all" 
                ? "Vous n'avez pas encore d'animaux. Commencez par en ajouter un !"
                : `Aucun animal avec le statut "${filter}".`
              }
            </p>
            <button
              type="button"
              className="add_first_animal_button"
              onClick={() => openModal("animal")}
            >
              <FontAwesomeIcon icon={faPlus} />
              Ajouter votre premier animal
            </button>
          </div>
        )}
      </div>
    </main>
  );
}