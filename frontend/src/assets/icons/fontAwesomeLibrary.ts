/**
 * BIBLIOTHÈQUE D'ICÔNES FONT AWESOME
 * 
 * Configuration centralisée des icônes Font Awesome utilisées :
 * - faXmark : Fermeture des modales et annulation
 * - faTrash : Suppression d'éléments
 * - faPen : Édition/modification
 * - faCheck : Validation/confirmation
 * 
 * Avantages :
 * - Import sélectif (bundle size optimisé)
 * - Configuration centralisée
 * - Réutilisabilité dans toute l'application
 */
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faXmark,
  faTrash,
  faPen,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function fontAwesomeLibrary() {
  library.add(faXmark, faPen, faTrash, faCheck);

  return library;
}
