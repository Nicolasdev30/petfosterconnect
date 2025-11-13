/**
 * PAGE LISTE DES ANIMAUX
 * 
 * Interface de recherche et consultation des animaux disponibles :
 * 
 * Fonctionnalités de filtrage :
 * - Espèce : Sélection parmi les espèces disponibles
 * - Race : Recherche textuelle libre
 * - Âge : Filtrage par tranches (< 1 an, 1-5 ans, 5-10 ans, > 10 ans)
 * 
 * Interface utilisateur :
 * - Formulaire de filtres responsive
 * - Grille d'animaux avec cartes détaillées
 * - Message informatif si aucun résultat
 * - Chargement dynamique des espèces disponibles
 * 
 * Optimisations :
 * - Appel API unique pour les espèces au chargement
 * - Recherche déclenchée par soumission de formulaire
 * - Gestion d'erreurs avec fallback gracieux
 * 
 * Accessibilité :
 * - Labels appropriés pour les champs
 * - Navigation clavier fonctionnelle
 * - Messages d'état pour lecteurs d'écran
 */
import "./AnimalsList.scss";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import AnimalCard from "../../components/AnimalCard/AnimalCard";

import type { Animal } from "../../types/animal";
import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { AnimalService } from "../../services/api/animalService";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const animalService = new AnimalService(axios);

export default function AnimalsList() {
  const [animals, setAnimals] = useState<Animal[]>();
  const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    species: "",
    breed: "",
    age: "",
  });

  // Récupérer toutes les espèces disponibles au chargement du composant
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const speciesData = await animalService.getSpecies();
        setAvailableSpecies(speciesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des espèces:", error);
      }
    };

    fetchSpecies();
  }, []);

  // Récupérer tous les animaux au chargement initial
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const animalsData = await animalService.getAnimals();
        setAnimals(animalsData);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else if (error instanceof Error) {
          console.error("General error:", error.message);
        }
      }
    };

    fetchAnimals();
  }, []);

  // Fonction pour gérer les changements de filtres
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fonction pour rechercher avec les filtres
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const searchParams = {
        species: filters.species || undefined,
        breed: filters.breed || undefined,
        age: filters.age || undefined,
      };

      const animalsData = await animalService.getAnimals(searchParams);
      setAnimals(animalsData);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Axios error:", error.message);
      } else if (error instanceof Error) {
        console.error("General error:", error.message);
      }
    }
  };

  return (
    <main className="animals">
      <form onSubmit={handleSearch} className="animals_form">
        <label htmlFor="species">
          <span>Espèce</span>
          <select
            name="species"
            id="species"
            value={filters.species}
            onChange={handleFilterChange}
          >
            <option value="">Toutes les espèces</option>
            {availableSpecies.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="breed">
          <span>Race</span>
          <input
            type="text"
            name="breed"
            id="breed"
            value={filters.breed}
            onChange={handleFilterChange}
            placeholder="Rechercher par race"
          />
        </label>

        <label htmlFor="age">
          <span>Âge</span>
          <select
            name="age"
            id="age"
            value={filters.age}
            onChange={handleFilterChange}
          >
            <option value="">Tous les âges</option>
            <option value="0">moins d'un an</option>
            <option value="1">1 à 5 ans</option>
            <option value="2">5 à 10 ans</option>
            <option value="3">plus de 10 ans</option>
          </select>
        </label>

        <button type="submit" className="animals_form_search_button">
          Rechercher
        </button>
      </form>

      {animals && animals.length ? (
        <ul className="animals_list">
          {animals.map((animal) => (
            <li key={animal.id_animal} className="animals_list_item">
              <AnimalCard animal={animal} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-animals-message">
          <h3>🐾 Aucun animal trouvé</h3>
          <p>
            Aucun animal ne correspond à vos critères de recherche. Essayez de
            modifier vos filtres ou consultez tous les animaux disponibles.
          </p>
        </div>
      )}
    </main>
  );
}
