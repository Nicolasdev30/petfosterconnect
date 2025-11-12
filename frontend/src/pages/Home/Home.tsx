/**
 * PAGE D'ACCUEIL DE L'APPLICATION
 * 
 * Page de présentation et point d'entrée principal :
 * 
 * Structure :
 * - Header avec illustration et slogan
 * - Liens d'action vers les fonctionnalités principales
 * - Section "Comment ça marche" avec étapes illustrées
 * - Section "Nos valeurs" avec principes de l'association
 * 
 * Fonctionnalités :
 * - Navigation vers /animals et /associations
 * - Design responsive mobile-first
 * - Illustrations avec icônes métier
 * - Call-to-action clairs pour l'engagement
 * 
 * Valeurs présentées :
 * - Bienveillance : Respect et attention aux animaux
 * - Confiance : Relations transparentes famille/association
 * - Accessibilité : Plateforme utilisable par tous
 */
import "./Home.scss";

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home">
      <header className="home_header">
        <div className="home_header_illustration"></div>
        <p className="home_header_text">
          Ensemble, offrons une famille aux animaux dans le besoin
        </p>
      </header>

      <ul className="home_list">
        <li className="home_list_item button">
          <Link to="/animals">Voir les animaux à acceuillir</Link>
        </li>
        <li className="home_list_item button">
          <Link to="/associations">Voir les associations</Link>
        </li>
      </ul>

      <aside className="home_aside">
        <div className="home_aside_works">
          <p>Comment ça marche ?</p>

          <div className="home_aside_works_container">
            <div className="home_aside_works_container_icon">
              <div className="home_aside_works_container_icon_img inscription"></div>
              <p>Inscription</p>
            </div>

            <div className="home_aside_works_container_icon">
              <div className="home_aside_works_container_icon_img search"></div>
              <p>Recherche d'animal</p>
            </div>

            <div className="home_aside_works_container_icon">
              <div className="home_aside_works_container_icon_img request"></div>
              <p>Demande d'acceuil</p>
            </div>
          </div>
        </div>

        <div className="home_aside_values">
          <p>Nos valeurs</p>

          <div className="home_aside_values_container">
            <div className="home_aside_values_container_icon">
              <div className="home_aside_values_container_icon_img kindness"></div>
              <p>Bienveillance</p>
            </div>

            <div className="home_aside_values_container_icon">
              <div className="home_aside_values_container_icon_img trust"></div>
              <p>Confiance</p>
            </div>

            <div className="home_aside_values_container_icon">
              <div className="home_aside_values_container_icon_img accessibility"></div>
              <p>Accessibilité</p>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
