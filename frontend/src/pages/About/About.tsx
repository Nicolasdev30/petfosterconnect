/**
 * PAGE À PROPOS
 * 
 * Présentation de l'équipe et de la mission :
 * 
 * Sections :
 * - Header : Titre et tagline de présentation
 * - Mission : Objectif principal de l'application
 * - Valeurs : Principes guidant le développement
 * - Objectif : Vision à long terme
 * - Footer : Call-to-action pour rejoindre la communauté
 * 
 * Contenu :
 * - Présentation de l'équipe de 4 développeurs
 * - Explication de la problématique résolue
 * - Valeurs de bienveillance, confiance, accessibilité
 * 
 * Design :
 * - Layout article avec sections structurées
 * - Typographie hiérarchisée
 * - Couleurs de marque cohérentes
 */

import "./About.scss";

export default function About() {
  return (
    <main className="about">
      <article className="about_article" aria-labelledby="about-title">
        {/* En-tête avec présentation générale */}
        <header className="about_article_header">
          <h1>À propos</h1>
          <p className="tagline">
            Une plateforme pensée par une équipe de quatre développeurs pour
            faciliter l’accueil temporaire des animaux en attente d’adoption.
          </p>
        </header>

        {/* Section mission : objectif principal */}
        <section
          className="about_article_mission"
          aria-labelledby="mission-title"
        >
          <h2>Notre mission</h2>
          <p>
            Notre application est née d’une conviction simple : chaque animal
            mérite un foyer chaleureux, même temporaire, en attendant son
            adoption définitive. Nous avons imaginé une plateforme qui facilite
            la mise en relation entre les associations, les familles d’accueil
            et les futurs adoptants.
          </p>
        </section>

        {/* Section valeurs : principes de développement */}
        <section
          className="about_article_values"
          aria-labelledby="values-title"
        >
          <h2>Nos valeurs</h2>
          <ul className="values">
            <li>
              <p>
                <strong>La bienveillance</strong> : chaque animal accueilli
                traverse une étape importante de sa vie. Nous croyons qu’il est
                essentiel de l’entourer d’attention, de respect et d’affection,
                pour qu’il puisse évoluer dans un environnement rassurant et
                positif.
              </p>
            </li>
            <li>
              <p>
                <strong>La confiance</strong> : nous plaçons la relation de
                confiance au cœur de notre projet. Les associations doivent
                pouvoir compter sur des familles sérieuses et impliquées ; les
                familles doivent, elles, être rassurées sur l’accompagnement et
                le suivi. Notre application est conçue pour renforcer ces liens
                de confiance et rendre chaque collaboration plus simple et plus
                transparente.
              </p>
            </li>
            <li>
              <p>
                <strong>L’accessibilité</strong> : nous voulons que notre
                plateforme soit utilisable par le plus grand nombre, qu’il
                s’agisse des associations partenaires, des familles d’accueil ou
                des futurs adoptants. Simplicité, clarté et ergonomie guident
                nos choix afin que chacun puisse participer facilement à cette
                belle chaîne de solidarité.
              </p>
            </li>
          </ul>
        </section>

        {/* Section objectif : vision à long terme */}
        <section className="about_article_goal" aria-labelledby="goal-title">
          <h2>Notre objectif</h2>
          <p>
            Contribuer à créer un monde où aucun animal ne reste sans foyer, et
            où chaque acteur – associations, familles et adoptants – trouve sa
            place dans un réseau bienveillant et solidaire.
          </p>
        </section>

        {/* Footer avec call-to-action */}
        <footer className="about_article_footer">
          <p>
            Vous partagez cette vision ? Rejoignez-nous et aidez-nous à offrir à
            chaque animal la transition qu’il mérite.
          </p>
        </footer>
      </article>
    </main>
  );
}
