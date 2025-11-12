/**
 * COMPOSANT CARTE ANIMAL
 * 
 * Affichage synthétique d'un animal dans les listes :
 * 
 * Informations affichées :
 * - Photo avec effet hover (zoom)
 * - Nom et statut (disponible/accueilli)
 * - Détails : espèce, race, sexe, âge
 * - Lien vers la page détaillée
 * 
 * Design :
 * - Card design avec ombres et transitions
 * - Badge de statut coloré selon disponibilité
 * - Grille d'informations organisée
 * - Bouton d'action proéminent
 * 
 * Interactions :
 * - Hover effects sur image et bouton
 * - Navigation vers /animal/:id
 * - Responsive design adaptatif
 * 
 * Props :
 * - animal : Objet Animal avec toutes les propriétés
 */
import "./AnimalCard.scss";

import { Link } from "react-router-dom";

import type { Animal } from "../../types/animal";

interface AnimalCardProps {
  animal: Animal;
}

export default function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <article className="animal_card">
      <img
        src={animal.photo_url}
        alt={animal.name}
        className="animal_card_img"
      />

      <div className="animal_card_content">
        <div className="animal_card_header">
          <h3>{animal.name}</h3>
          <span className={`status status--${animal.status}`}>
            {animal.status}
          </span>
        </div>

        <section className="animal_card_section">
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
        </section>

        <Link to={`/animal/${animal.id_animal}`} className="animal_card_link">
          Voir plus
        </Link>
      </div>
    </article>
  );
}
