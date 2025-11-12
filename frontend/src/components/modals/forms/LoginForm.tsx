/**
 * FORMULAIRE DE CONNEXION
 * 
 * Interface de connexion utilisateur :
 * 
 * Champs requis :
 * - Email : Validation HTML5 + backend
 * - Mot de passe : Champ sécurisé
 * 
 * Fonctionnalités :
 * - Validation côté client (required, type="email")
 * - Gestion des erreurs avec affichage
 * - Soumission via le contexte modal
 * - Placeholders informatifs
 * 
 * Sécurité :
 * - Type password pour masquer la saisie
 * - Validation backend avec express-validator
 * - Gestion des tentatives de connexion échouées
 * 
 * UX :
 * - Labels accessibles
 * - Messages d'erreur contextuels
 * - Design cohérent avec les autres formulaires
 */
import "./forms.scss";

interface LoginFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
}

export default function LoginForm({ handleSubmit, error }: LoginFormProps) {
  return (
    <div className="form_modal">
      <h3 className="form_modal_title">Connexion</h3>
      <form onSubmit={handleSubmit} className="form_modal_form" role="form">
        <label htmlFor="email" className="form_modal_form_label">
          <span>Email:</span>
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="Email"
            className="form_modal_form_label_input"
          />
        </label>

        <label htmlFor="password" className="form_modal_form_label">
          <span>Mot de passe:</span>
          <input
            type="password"
            name="password"
            id="password"
            required
            placeholder="Mot de passe"
            className="form_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aria-label="Login"
          className="form_modal_form_button button"
        >
          Se connecter
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}
