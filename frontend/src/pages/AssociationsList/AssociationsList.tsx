/**
 * PAGE LISTE DES ASSOCIATIONS
 * 
 * Interface de recherche et consultation des associations :
 * 
 * Fonctionnalités de filtrage :
 * - Nom : Sélection parmi les associations existantes
 * - Ville : Filtrage par localisation géographique
 * - Recherche combinée avec plusieurs critères
 * 
 * Chargement intelligent des données :
 * - Associations : Liste complète au chargement initial
 * - Noms disponibles : Pour le dropdown de filtrage
 * - Villes disponibles : Extraction automatique des adresses
 * 
 * Interface utilisateur :
 * - Formulaire de filtres avec dropdowns
 * - Grille responsive d'associations
 * - Message informatif si aucun résultat
 * - Bouton de recherche pour déclencher le filtrage
 * 
 * Optimisations :
 * - Chargement parallèle des données de filtrage
 * - Recherche déclenchée manuellement (pas en temps réel)
 * - Gestion d'erreurs avec fallback gracieux
 */
import "./AssociationsList.scss";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import AssociationCard from "../../components/AssociationCard/AssociationCard";

import type { Association } from "../../types/association";
import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { AssociationService } from "../../services/api/associationService";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const associationService = new AssociationService(axios);

export default function AssociationsList() {
  const [associations, setAssociations] = useState<Association[]>();
  const [availableNames, setAvailableNames] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // États des filtres
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Charger les données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Charger les associations sans filtres
        const associationsData = await associationService.getAssociations();
        setAssociations(associationsData);

        // Charger les noms et villes disponibles
        const [names, cities] = await Promise.all([
          associationService.getAssociationNames(),
          associationService.getAssociationCities(),
        ]);

        setAvailableNames(names);
        setAvailableCities(cities);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else if (error instanceof Error) {
          console.error("General error:", error.message);
        }
      }
    };

    fetchInitialData();
  }, []);

  // Fonction de recherche
  const handleSearch = async () => {
    try {
      const params = {
        ...(selectedName && { name: selectedName }),
        ...(selectedCity && { city: selectedCity }),
      };

      const filteredAssociations = await associationService.getAssociations(
        params
      );
      setAssociations(filteredAssociations);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Axios error:", error.message);
      } else if (error instanceof Error) {
        console.error("General error:", error.message);
      }
    }
  };

  return (
    <main className="associations">
      <section className="associations__filters">
        <h2 className="associations__filters-title">
          Filtrer les associations
        </h2>

        <form
          className="associations__filters-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="associations__filters-group">
            <label htmlFor="name" className="associations__filters-label">
              Nom de l'association:
            </label>
            <select
              id="name"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="associations__filters-select"
            >
              <option value="">Toutes les associations</option>
              {availableNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="associations__filters-group">
            <label htmlFor="city" className="associations__filters-label">
              Ville:
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="associations__filters-select"
            >
              <option value="">Toutes les villes</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="associations__filters-button"
          >
            Rechercher
          </button>
        </form>
      </section>

      {associations && associations.length ? (
        <ul className="associations__list">
          {associations.map((association) => (
            <li
              key={association.id_association}
              className="associations__list-item"
            >
              <AssociationCard association={association} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="associations__no-results">
          Aucune association ne correspond à votre recherche
        </div>
      )}
    </main>
  );
}
