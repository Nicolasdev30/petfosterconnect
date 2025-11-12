/**
 * COMPOSANT CARTE ASSOCIATION
 * 
 * Affichage synthétique d'une association dans les listes :
 * 
 * Informations affichées :
 * - Photo/logo avec fallback vers logo par défaut
 * - Nom de l'association
 * - Coordonnées : email, téléphone, adresse
 * - Lien vers la page détaillée
 * 
 * Design :
 * - Card design cohérent avec AnimalCard
 * - Layout flexible pour différentes longueurs de contenu
 * - Effet hover sur l'image
 * - Bouton d'action avec couleur accent
 * 
 * Fonctionnalités :
 * - Navigation vers /association/:id
 * - Gestion du fallback d'image
 * - Responsive design adaptatif
 * 
 * Props :
 * - association : Objet Association avec coordonnées
 */
import "./AssociationCard.scss";

import { Link } from "react-router-dom";

import type { Association } from "../../types/association";

interface AssociationCardProps {
  association: Association;
}

export default function AssociationCard({ association }: AssociationCardProps) {
  return (
    <article className="association-card">
      <div className="association-card__image-container">
        <img
          src={association.photo || "/petfosterconnect_logo.webp"}
          alt={association.name}
          className="association-card__image"
        />
      </div>

      <div className="association-card__content">
        <h3 className="association-card__name">{association.name}</h3>

        <div className="association-card__info">
          <div className="association-card__info-item">
            <span className="association-card__label">Email:</span>
            <span className="association-card__value">{association.email}</span>
          </div>

          <div className="association-card__info-item">
            <span className="association-card__label">Téléphone:</span>
            <span className="association-card__value">{association.phone}</span>
          </div>

          <div className="association-card__info-item">
            <span className="association-card__label">Adresse:</span>
            <span className="association-card__value">
              {association.address}
            </span>
          </div>
        </div>

        <Link
          to={`/association/${association.id_association}`}
          className="association-card__button"
        >
          Voir plus
        </Link>
      </div>
    </article>
  );
}
