/**
 * PAGE DÉTAILS D'UN ANIMAL
 * 
 * Affichage complet des informations d'un animal :
 * 
 * Sections principales :
 * - Header : Photo, nom, statut, informations de base
 * - Description : Présentation détaillée de l'animal
 * - Association : Coordonnées de l'association responsable
 * - Actions : Boutons pour demande d'accueil
 * 
 * Fonctionnalités :
 * - Bouton retour vers page précédente
 * - Demande d'accueil (si connecté en tant que famille)
 * - Affichage conditionnel selon le statut
 * - Navigation vers liste complète des animaux
 * 
 * Gestion d'état :
 * - Chargement des données via useParams (ID depuis URL)
 * - Redirection si ID invalide
 * - États de chargement avec feedback utilisateur
 * 
 * Sécurité :
 * - Vérification de l'authentification pour actions
 * - Validation de l'ID animal
 * - Gestion d'erreurs avec messages appropriés
 */
import "./AnimalDetails.scss";

import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";

import type { AnimalExtended } from "../../types/animal";

import { Config } from "../../config/config";
import { useAuth } from "../../contexts/authContext";
import { useNotification } from "../../contexts/NotificationContext";
import { ApiClient } from "../../services/client";
import { AnimalService } from "../../services/api/animalService";
import { RequestService } from "../../services/api/requestService";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const animalService = new AnimalService(axios);
const requestService = new RequestService(axios);

export default function AnimalDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [animal, setAnimal] = useState<AnimalExtended | null>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) return;

      try {
        const animalData = await animalService.getAnimalById(id);
        setAnimal(animalData);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else if (error instanceof Error) {
          console.error("General error:", error.message);
        }
      }
    };

    fetchAnimal();
  }, [id]);

  if (!id) {
    return <Navigate to="/not-found" replace />;
  }

  if (!animal) {
    return (
      <div className="loading">
        <p>Chargement...</p>
      </div>
    );
  }

  const handleRequest = async () => {
    if (!user) {
      showError(
        "Connexion requise",
        "Vous devez être connecté pour faire une demande d'accueil"
      );
      return;
    }

    console.log("User role:", user.role);
    console.log("Animal ID:", animal.id_animal);
    console.log("User ID:", user.id_user);

    try {
      await requestService.createRequest(animal.id_animal, user.id_user);
      showSuccess(
        "Demande envoyée",
        "Votre demande d'accueil a été envoyée avec succès"
      );
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Une erreur est survenue";
        showError("Erreur", message);
      } else if (error instanceof Error) {
        showError("Erreur", error.message);
      }
    }
  };

  return (
    <main className="animal_details">
      <div className="animal_details_container">
        {/* Bouton retour */}
        <div className="animal_details_back">
          <button
            type="button"
            className="back_button"
            onClick={() => navigate(-1)}
            aria-label="Retour à la page précédente"
          >
            <span className="back_icon">←</span>
            <span>Retour</span>
          </button>
        </div>

        {/* Header avec image et infos principales */}
        <div className="animal_details_header">
          <div className="animal_details_image_container">
            <img
              src={animal.photo_url}
              alt={animal.name}
              className="animal_details_img"
            />
            <span className={`status status--${animal.status}`}>
              {animal.status}
            </span>
          </div>

          <div className="animal_details_main_info">
            <h1 className="animal_name">{animal.name}</h1>

            <div className="animal_details_grid">
              <div className="info-item">
                <span className="label">Espèce</span>
                <span className="value">{animal.species}</span>
              </div>
              <div className="info-item">
                <span className="label">Race</span>
                <span className="value">{animal.breed}</span>
              </div>
              <div className="info-item">
                <span className="label">Sexe</span>
                <span className="value">{animal.sex}</span>
              </div>
              <div className="info-item">
                <span className="label">Âge</span>
                <span className="value">
                  {animal.age} an{animal.age > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {animal.description && (
          <div className="animal_details_description">
            <h2>À propos de {animal.name}</h2>
            <p>{animal.description}</p>
          </div>
        )}

        {/* Informations association */}
        <div className="animal_details_association">
          <h2>Association responsable</h2>
          <div className="association_card">
            <div className="association_info">
              <h3>{animal.association.name}</h3>
              <div className="association_details">
                <div className="contact-item">
                  <span className="label">📍 Adresse</span>
                  <span className="value">{animal.association.address}</span>
                </div>
                <div className="contact-item">
                  <span className="label">📧 Email</span>
                  <span className="value">{animal.association.email}</span>
                </div>
                <div className="contact-item">
                  <span className="label">📞 Téléphone</span>
                  <span className="value">{animal.association.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="animal_details_actions">
          <div className="action_buttons">
            <button
              type="button"
              className="secondary_button"
              onClick={() => navigate("/animals")}
            >
              🐾 Voir tous les animaux
            </button>
            <button
              type="button"
              className="primary_button"
              onClick={handleRequest}
            >
              💝 Demande d'accueil
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
