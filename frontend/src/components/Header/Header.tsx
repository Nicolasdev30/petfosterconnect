/**
 * COMPOSANT HEADER/NAVIGATION PRINCIPALE
 * 
 * Barre de navigation responsive avec authentification :
 * 
 * Éléments fixes :
 * - Logo cliquable (retour accueil)
 * - Lien "Accueil" toujours visible
 * 
 * Navigation conditionnelle :
 * 
 * Utilisateur connecté :
 * - Lien "Profil" vers la gestion du compte
 * - Bouton "Déconnexion" avec action logout
 * 
 * Utilisateur non connecté :
 * - Bouton "Connexion" → modal de login
 * - Bouton "Inscription" → modal de register
 * 
 * Fonctionnalités :
 * - Responsive design (mobile-first)
 * - États visuels (hover, active)
 * - Intégration avec les contextes (auth, modal)
 * - Sticky positioning pour navigation permanente
 */
import "./Header.scss";

import { Link } from "react-router-dom";

import { useModal } from "../../contexts/modalContext";
import { useAuth } from "../../contexts/authContext";

export default function Header() {
  const { openModal } = useModal();
  const { user, logout } = useAuth();

  return (
    <header>
      <nav>
        <Link to="/" className="logo_link">
          <div className="logo"></div>
        </Link>
        <ul>
          <li className="nav_link link">
            <Link to="/">Acceuil</Link>
          </li>
          {user ? (
            <>
              <li className="link">
                <Link to="/profile">Profil</Link>
              </li>
              {user.role.label === "association" && user.association && (
                <li className="link">
                  <Link to="/manage-animals">Mes animaux</Link>
                </li>
              )}

              <li>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="button"
                >
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("login")}
                  className="button"
                >
                  Connexion
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => openModal("register")}
                  className="button"
                >
                  Inscription
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
