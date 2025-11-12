/**
 * COMPOSANT FOOTER/PIED DE PAGE
 * 
 * Pied de page avec liens utiles et partenaires :
 * 
 * Section liens internes :
 * - À propos : Présentation de l'équipe et mission
 * - Mentions légales : CGU de l'application
 * - Politique de confidentialité : Gestion des données RGPD
 * 
 * Section liens externes :
 * - Partenaires associatifs (SPA, Fondation Brigitte Bardot, WWF)
 * - Ouverture dans nouvel onglet (target="_blank")
 * - Attribut rel="noreferrer" pour la sécurité
 * 
 * Design :
 * - Layout en grille responsive
 * - Couleur de marque (vert primaire)
 * - Copyright et droits réservés
 */
import { Link } from "react-router-dom";

import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer_container">
        <div className="footer_container_list">
          <ul>
            <li>
              <Link to="/about">À propos</Link>
            </li>
            <li>
              <Link to="/CGU">Mentions légales</Link>
            </li>
            <li>
              <Link to="/policies">Politique de confidentialité</Link>
            </li>
          </ul>
        </div>

        <div className="footer_container_list">
          <ul>
            <li>
              <a href="https://www.la-spa.fr/" target="_blank" rel="noreferrer">
                La SPA
              </a>
            </li>
            <li>
              <a
                href="https://www.fondationbrigittebardot.fr/"
                target="_blank"
                rel="noreferrer"
              >
                Fondation Brigitte Bardot
              </a>
            </li>
            <li>
              <a href="https://www.wwf.fr/" target="_blank" rel="noreferrer">
                WWF
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p>® Tout droits réservés</p>
    </footer>
  );
}
