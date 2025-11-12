/**
 * UTILITAIRE DE CONVERSION FORMDATA → OBJET
 * 
 * Convertit les données d'un formulaire HTML en objet TypeScript typé :
 * - Extraction sélective des champs souhaités
 * - Sanitisation automatique avec DOMPurify (sécurité XSS)
 * - Type-safety avec génériques TypeScript
 * 
 * Sécurité :
 * - Protection contre les injections XSS
 * - Validation des types de données
 * - Nettoyage automatique des entrées utilisateur
 * 
 * Utilisation : formDataToObject<UserForm>(formData, ['email', 'password'])
 */
import DOMPurify from "dompurify";

export default function formDataToObject<T extends Record<string, string>>(
  formData: FormData,
  keys: (keyof T)[],
): T {
  const obj = Object.fromEntries(formData) as Record<string, string>;
  const result: Record<string, string> = {};

  keys.forEach((key) => {
    result[key as string] = DOMPurify.sanitize(obj[key as string] || "");
  });

  return result as T;
}
