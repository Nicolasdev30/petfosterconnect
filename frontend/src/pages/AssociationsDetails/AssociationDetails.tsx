/**
 * PAGE DÉTAILS D'UNE ASSOCIATION
 * 
 * Affichage complet des informations d'une association :
 * 
 * Sections principales :
 * - Header : Photo, nom, coordonnées complètes
 * - Animaux : Grille des animaux gérés par l'association
 * - Actions : Boutons de contact et navigation
 * 
 * Fonctionnalités :
 * - Bouton retour vers page précédente
 * - Affichage conditionnel des animaux (avec/sans)
 * - Contact association (fonctionnalité en développement)
 * - Navigation vers liste complète des associations
 * 
 * Gestion d'état :
 * - Chargement via useParams (ID depuis URL)
 * - Redirection si ID invalide
 * - États de chargement avec feedback
 * 
 * UX améliorée :
 * - Notification informative pour contact
 * - Réutilisation des composants AnimalCard
 * - Design cohérent avec le reste de l'application
 */
import "./AssociationDetails.scss";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import AnimalCard from "../../components/AnimalCard/AnimalCard";

import type { AssociationExtended } from "../../types/association";

import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { AssociationService } from "../../services/api/associationService";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const associationService = new AssociationService(axios);

export default function AssociationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showInfo } = useNotification();
  const [association, setAssociation] = useState<AssociationExtended | null>(
    null
  );

  const handleContactAssociation = () => {
    showInfo(
      "Fonctionnalité en développement",
      "Le formulaire de contact sera bientôt disponible ! En attendant, utilisez les coordonnées affichées sur cette page.",
      6000
    );
  };

  if (!id) {
    return <Navigate to="/not-found" replace />;
  }

  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        const associationData = await associationService.getAssociationById(id);
        setAssociation(associationData);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else if (error instanceof Error) {
          console.error("General error:", error.message);
        }
      }
    };

    fetchAssociation();
  }, []);

  if (!association) {
    return <p>Chargement...</p>;
  }

  return (
    <main className="association_details">
      {/* Bouton retour */}
      <div className="association_details_back">
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

      <header className="association_details_header">
        <div className="association_details_hero">
          {association.photo && (
            <img
              src={association.photo}
              alt={association.name}
              className="association_details_photo"
            />
          )}
          <div className="association_details_info">
            <h1 className="association_details_title">{association.name}</h1>
            <div className="association_details_contact">
              <div className="contact_item">
                <span className="contact_label">Email</span>
                <span className="contact_value">{association.email}</span>
              </div>
              <div className="contact_item">
                <span className="contact_label">Téléphone</span>
                <span className="contact_value">{association.phone}</span>
              </div>
              <div className="contact_item">
                <span className="contact_label">Adresse</span>
                <span className="contact_value">{association.address}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {association.animals && association.animals.length ? (
        <section className="association_details_animals">
          <h2>Nos animaux recherchent une famille d'accueil</h2>
          <ul className="animals_grid">
            {association.animals.map((animal) => (
              <li key={animal.id_animal} className="animals_grid_item">
                <AnimalCard animal={animal} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="association_details_no_animals">
          <h2>Nos animaux</h2>
          <p>Tous nos animaux sont actuellement placés en famille d'accueil</p>
        </section>
      )}

      {/* Boutons d'action */}
      <div className="association_details_actions">
        <div className="action_buttons">
          <button
            type="button"
            className="secondary_button"
            onClick={() => navigate("/associations")}
          >
            🏠 Voir toutes les associations
          </button>
          <button
            type="button"
            className="primary_button"
            onClick={handleContactAssociation}
          >
            📞 Contacter l'association
          </button>
        </div>
      </div>
    </main>
  );
}
