/**
 * PAGE CONDITIONS GÉNÉRALES D'UTILISATION (CGU)
 * 
 * Document légal obligatoire pour l'application :
 * 
 * Sections légales :
 * - Objet : Définition du cadre d'utilisation
 * - Acceptation : Modalités d'acceptation des CGU
 * - Accès : Conditions d'accès au service
 * - Compte : Gestion des comptes utilisateur
 * - Engagements : Obligations des utilisateurs
 * - Responsabilité : Limitation de responsabilité
 * 
 * Conformité juridique :
 * - Respect du droit français
 * - Protection des données (RGPD)
 * - Responsabilités clairement définies
 * 
 * Accessibilité :
 * - Structure sémantique avec aria-labels
 * - Hiérarchie de titres respectée
 * - Contenu lisible et organisé
 */

import "./CGU.scss";

export default function CGU() {
  return (
    <main className="CGU">
      <article aria-labelledby="cgu-title" className="CGU_article">
        {/* En-tête du document légal */}
        <header className="CGU_article_header">
          <h1>Conditions Générales d’Utilisation (CGU)</h1>
          <p>
            <strong>Dernière mise à jour :</strong> 21/08/2025
          </p>
        </header>

        {/* Section 1 : Objet des CGU */}
        <section aria-labelledby="object" className="CGU_article_object">
          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales d’Utilisation (ci-après « CGU »)
            ont pour objet de définir les modalités et conditions d’accès et
            d’utilisation de l’application <strong>PetFosterConnect</strong>,
            plateforme facilitant la mise en relation entre les associations de
            protection animale, les familles d’accueil temporaires et les
            adoptants potentiels.
          </p>
        </section>

        {/* Section 2 : Acceptation des conditions */}
        <section
          aria-labelledby="acceptance"
          className="CGU_article_acceptance"
        >
          <h2>2. Acceptation des CGU</h2>
          <p>
            L’utilisation de l’application implique l’acceptation pleine et
            entière des présentes CGU par l’utilisateur. En cas de désaccord,
            l’utilisateur est invité à ne pas utiliser l’application.
          </p>
        </section>

        {/* Section 3 : Conditions d'accès */}
        <section aria-labelledby="access" className="CGU_article_access">
          <h2>3. Accès au service</h2>
          <ul>
            <li>
              L’accès à l’application est gratuit pour les utilisateurs, sous
              réserve de disposer d’un accès internet.
            </li>
            <li>
              L’équipe éditrice se réserve le droit de limiter ou de suspendre
              l’accès en cas de maintenance ou de mise à jour.
            </li>
          </ul>
        </section>

        {/* Section 4 : Gestion des comptes */}
        <section aria-labelledby="account" className="CGU_article_account">
          <h2>4. Inscription et compte utilisateur</h2>
          <ul>
            <li>
              Certaines fonctionnalités nécessitent la création d’un compte
              utilisateur.
            </li>
            <li>
              L’utilisateur s’engage à fournir des informations exactes et à les
              mettre à jour régulièrement.
            </li>
            <li>
              L’utilisateur est responsable de la confidentialité de ses
              identifiants et de toute activité réalisée via son compte.
            </li>
          </ul>
        </section>

        {/* Section 5 : Obligations des utilisateurs */}
        <section
          aria-labelledby="engagements"
          className="CGU_article_engagements"
        >
          <h2>5. Engagements des utilisateurs</h2>
          <p>En utilisant l’application, l’utilisateur s’engage à :</p>
          <ul>
            <li>
              Ne pas fournir de fausses informations concernant son identité ou
              sa capacité à accueillir un animal.
            </li>
            <li>
              Respecter les conditions fixées par les associations concernant
              l’accueil et le suivi des animaux.
            </li>
            <li>
              Ne pas utiliser la plateforme à des fins frauduleuses,
              commerciales non autorisées ou contraires à la loi.
            </li>
          </ul>
        </section>

        {/* Section 6 : Limitation de responsabilité */}
        <section
          aria-labelledby="responsability"
          className="CGU_article_responsability"
        >
          <h2>6. Responsabilité</h2>
          <ul>
            <li>
              L’équipe éditrice de l’application met tout en œuvre pour assurer
              un service fiable, mais ne saurait être tenue responsable en cas
              d’erreurs, d’interruptions ou de dommages liés à l’utilisation du
              service.
            </li>
            <li>
              Les associations restent seules responsables de la sélection des
              familles d’accueil et du suivi des animaux.
            </li>
            <li>
              Les utilisateurs sont responsables de leurs interactions et
              engagements réciproques via la plateforme.
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}
