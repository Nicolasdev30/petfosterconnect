/**
 * PAGE 404 - PAGE NON TROUVÉE
 * 
 * Page d'erreur personnalisée pour les routes inexistantes :
 * 
 * Éléments :
 * - Illustration humoristique (chien détective)
 * - Message d'erreur avec humour
 * - Bouton de retour vers l'accueil
 * 
 * UX :
 * - Ton léger pour dédramatiser l'erreur
 * - Navigation claire vers la page d'accueil
 * - Design cohérent avec l'identité visuelle
 * 
 * Fonctionnalités :
 * - Redirection automatique vers l'accueil
 * - Message personnalisé avec thème animalier
 * - Responsive design adaptatif
 */

import "./NotFound.scss";

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="not_found">
      {/* Illustration d'erreur 404 avec thème animalier */}
      <div className="not_found_img"></div>
      
      {/* Message d'erreur avec humour */}
      <p className="not_found_text">
        Oops! Il semblerait que vous ne soyez pas un fin limier.
      </p>
      
      {/* Bouton de retour vers l'accueil */}
      <Link to="/" className="not_found_link button">
        Accueil
      </Link>
    </main>
  );
}
