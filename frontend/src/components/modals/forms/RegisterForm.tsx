/**
 * FORMULAIRE D'INSCRIPTION
 * 
 * Interface de création de compte utilisateur :
 * 
 * Champs requis :
 * - Prénom et nom : Informations personnelles
 * - Email : Identifiant unique de connexion
 * - Mot de passe : Avec validation de sécurité
 * - Confirmation : Vérification de saisie
 * 
 * Validations :
 * - Côté client : HTML5 (required, type, title)
 * - Côté serveur : express-validator + regex
 * - Confirmation de mot de passe
 * 
 * Sécurité :
 * - Mot de passe fort requis (majuscule, minuscule, chiffre)
 * - Email unique vérifié en base
 * - Sanitisation des entrées
 * 
 * Workflow :
 * - Inscription → rôle "utilisateur" par défaut
 * - Possibilité de créer/rejoindre association après
 */
import "./forms.scss";

interface RegisterFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
}

export default function RegisterForm({
  handleSubmit,
  error,
}: RegisterFormProps) {
  return (
    <div className="form_modal">
      <h3 className="form_modal_title">Inscription</h3>
      <form onSubmit={handleSubmit} className="form_modal_form" role="form">
        <label htmlFor="first_name" className="form_modal_form_label">
          <span>Prénom:</span>
          <input
            type="text"
            name="first_name"
            id="first_name"
            required
            placeholder="Prénom"
            className="form_modal_form_label_input"
          />
        </label>

        <label htmlFor="last_name" className="form_modal_form_label">
          <span>Nom:</span>
          <input
            type="text"
            name="last_name"
            id="last_name"
            required
            placeholder="Nom"
            className="form_modal_form_label_input"
          />
        </label>

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
            title="Le mot de passe ne respecte pas les conditions minimales de sécurité"
            placeholder="Mot de passe"
            className="form_modal_form_label_input"
          />
        </label>

        <label htmlFor="confirmPassword" className="form_modal_form_label">
          <span>Confirmation mot de passe:</span>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            required
            placeholder="Confirmation mot de passe"
            className="form_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aria-label="Register"
          className="form_modal_form_button button"
        >
          S'incrire
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}
