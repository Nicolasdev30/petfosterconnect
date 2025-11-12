/**
 * PAGE POLITIQUE DE CONFIDENTIALITÉ
 * 
 * Document RGPD obligatoire pour la conformité :
 * 
 * Sections RGPD :
 * - Introduction : Cadre légal et objectifs
 * - Données collectées : Types d'informations traitées
 * - Finalités : Objectifs du traitement des données
 * - Base légale : Fondements juridiques (RGPD Art. 6)
 * - Partage : Destinataires des données
 * 
 * Conformité RGPD :
 * - Transparence sur les traitements
 * - Information claire des utilisateurs
 * - Respect des droits (accès, rectification, effacement)
 * 
 * Accessibilité :
 * - Structure sémantique claire
 * - Contenu organisé et lisible
 * - Navigation facilitée
 */

import "./Policies.scss";

export default function Policies() {
  return (
    <main className="policies">
      <article aria-labelledby="privacy-title" className="policies_article">
        {/* En-tête du document de confidentialité */}
        <header className="policies_article_header">
          <h1>Politique de confidentialité</h1>
          <p>
            <strong>Dernière mise à jour :</strong> 21/08/2025
          </p>
        </header>

        {/* Section 1 : Introduction et cadre légal */}
        <section aria-labelledby="intro" className="policies_article_intro">
          <h2>1. Introduction</h2>
          <p>
            La présente Politique de confidentialité a pour objectif d’informer
            les utilisateurs de l’application <strong>PetFosterConnect</strong>{" "}
            sur la manière dont leurs données personnelles sont collectées,
            traitées et protégées.
          </p>
        </section>

        {/* Section 2 : Types de données collectées */}
        <section
          aria-labelledby="data-collected"
          className="policies_article_data"
        >
          <h2>2. Données collectées</h2>
          <p>
            Dans le cadre de l’utilisation de l’application, nous pouvons
            collecter les catégories de données suivantes :
          </p>
          <ul>
            <li>
              Informations d’identification : nom, prénom, adresse e‑mail,
              numéro de téléphone.
            </li>
            <li>
              Informations relatives au compte utilisateur : identifiants,
              préférences.
            </li>
            <li>
              Informations fournies lors de la mise en relation avec une
              association ou de l’accueil d’un animal.
            </li>
            <li>
              Données techniques : logs de connexion, adresse IP, type de
              terminal et navigateur utilisé.
            </li>
          </ul>
        </section>

        {/* Section 3 : Finalités du traitement (RGPD Art. 5) */}
        <section
          aria-labelledby="purposes"
          className="policies_article_purposes"
        >
          <h2>3. Finalités du traitement</h2>
          <ul>
            <li>
              Permettre la création et la gestion des comptes utilisateurs.
            </li>
            <li>
              Faciliter la mise en relation entre associations, familles
              d’accueil et adoptants.
            </li>
            <li>
              Garantir le bon fonctionnement, la sécurité et l’amélioration de
              l’application.
            </li>
            <li>
              Respecter les obligations légales et réglementaires applicables.
            </li>
          </ul>
        </section>

        {/* Section 4 : Base légale du traitement (RGPD Art. 6) */}
        <section
          aria-labelledby="legal-basis"
          className="policies_article_legal"
        >
          <h2>4. Base légale du traitement</h2>
          <p>Conformément au RGPD, nos traitements reposent sur :</p>
          <ul>
            <li>
              Votre consentement lorsque vous fournissez volontairement vos
              informations ou acceptez l’utilisation de certaines
              fonctionnalités.
            </li>
            <li>
              L’exécution d’un contrat pour permettre l’utilisation de nos
              services.
            </li>
            <li>
              Nos obligations légales, notamment en matière de conservation de
              certaines données.
            </li>
            <li>
              Le cas échéant, notre intérêt légitime pour assurer la sécurité et
              l’amélioration de l’application, dans le respect de vos droits et
              intérêts.
            </li>
          </ul>
        </section>

        {/* Section 5 : Partage et destinataires des données */}
        <section aria-labelledby="sharing" className="policies_article_sharing">
          <h2>5. Partage des données</h2>
          <p>
            Vos données peuvent être communiquées uniquement aux destinataires
            suivants :
          </p>
          <ul>
            <li>
              Associations partenaires, dans le cadre de la mise en relation
              avec les familles d’accueil.
            </li>
            <li>
              Membres de notre équipe technique, dans la stricte mesure
              nécessaire au fonctionnement du service.
            </li>
            <li>
              Prestataires techniques (hébergement, maintenance, analyses de
              performance) agissant en qualité de sous‑traitants, liés par des
              obligations contractuelles de confidentialité et de sécurité.
            </li>
          </ul>
          <p>
            Nous ne vendons ni ne louons vos données à des tiers à des fins
            commerciales.
          </p>
        </section>
      </article>
    </main>
  );
}
