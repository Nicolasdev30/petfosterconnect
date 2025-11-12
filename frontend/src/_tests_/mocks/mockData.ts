/**
 * DONNÉES DE TEST MOCKÉES - MOCKDATA.TS
 * 
 * Ce fichier contient toutes les données de test réutilisables
 * pour simuler les objets de l'application (utilisateurs, animaux,
 * associations, demandes) sans avoir besoin de vraies données.
 * 
 * POURQUOI UTILISER DES MOCKS ?
 * 
 * 1. ISOLATION : Les tests ne dépendent pas de données externes
 * 2. RAPIDITÉ : Pas besoin d'appels API ou de base de données
 * 3. PRÉVISIBILITÉ : Même données à chaque exécution
 * 4. CONTRÔLE : On peut tester des cas spécifiques facilement
 * 
 * PRINCIPE DES MOCKS :
 * Au lieu de récupérer de vraies données depuis l'API,
 * on utilise des objets JavaScript prédéfinis qui respectent
 * la même structure que les vraies données.
 */

// IMPORTS DES TYPES TYPESCRIPT
import type { AuthUser } from '../../types/user'
import type { Animal, AnimalExtended } from '../../types/animal'
import type { Association, AssociationExtended } from '../../types/association'
import type { RequestExtended } from '../../types/request'

/**
 * SECTION 1 : MOCKS DES RÔLES UTILISATEUR
 * 
 * Simule les rôles disponibles dans l'application
 */

// Mock du rôle "famille d'accueil"
export const mockRole = {
  id_role: 1,
  label: 'foster' // Famille d'accueil (peut faire des demandes)
}

// Mock du rôle "gestionnaire d'association"
export const mockAssociationRole = {
  id_role: 2,
  label: 'association' // Gestionnaire (peut gérer des animaux)
}

/**
 * SECTION 2 : MOCK D'UNE ASSOCIATION
 * 
 * Simule une association de protection animale avec
 * toutes les informations de contact nécessaires
 */
export const mockAssociation: Association = {
  id_association: '1',
  name: 'Test Association',
  email: 'test@association.com',
  phone: '0123456789',
  address: '123 Test Street, Test City',
  photo: '/petfosterconnect_logo.webp' // Logo par défaut
}

/**
 * SECTION 3 : MOCKS DES UTILISATEURS
 * 
 * Simule différents types d'utilisateurs pour tester
 * les comportements selon les rôles
 */

// Mock d'un utilisateur famille d'accueil (foster)
export const mockUser: AuthUser = {
  id_user: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@test.com',
  password: '********',        // Mot de passe masqué (jamais exposé)
  id_role: '1',
  id_association: null,        // Pas rattaché à une association
  role: mockRole,              // Rôle foster
  association: null,           // Pas d'association
  requests: []                 // Pas de demandes pour simplifier
}

// Mock d'un utilisateur gestionnaire d'association
export const mockAssociationUser: AuthUser = {
  ...mockUser,                 // Copie toutes les propriétés de mockUser
  id_user: '2',                // Mais change l'ID
  id_role: '2',                // Et le rôle
  id_association: '1',         // Rattaché à l'association mockAssociation
  role: mockAssociationRole,   // Rôle association
  association: {
    ...mockAssociation,        // Association complète
    animals: []                // Pas d'animaux pour simplifier
  }
}

/**
 * SECTION 4 : MOCKS DES ANIMAUX
 * 
 * Simule des animaux avec différents statuts pour tester
 * tous les cas d'affichage
 */

// Mock d'un animal disponible (statut par défaut)
export const mockAnimal: Animal = {
  id_animal: '1',
  name: 'Rex',
  species: 'Chien',
  breed: 'Berger Allemand',
  sex: 'Mâle',
  age: 5,
  description: 'Gentil chien protecteur',
  photo_url: 'https://example.com/rex.jpg',
  status: 'disponible'         // Statut disponible pour adoption
}

// Mock d'un animal avec relations complètes (pour les pages de détails)
export const mockAnimalExtended: AnimalExtended = {
  ...mockAnimal,               // Toutes les propriétés de base
  association: mockAssociation, // Association responsable
  requests: []                 // Demandes reçues (vide pour simplifier)
}

// Mock d'un animal déjà accueilli (pour tester le statut "accueilli")
export const mockAnimalAccueilli: Animal = {
  ...mockAnimal,               // Même animal que Rex
  id_animal: '2',              // Mais avec un ID différent
  name: 'Luna',                // Et un nom différent
  status: 'accueilli'          // Statut accueilli (plus disponible)
}

/**
 * SECTION 5 : MOCK D'UNE DEMANDE D'ACCUEIL
 * 
 * Simule une demande faite par une famille pour adopter un animal
 */
export const mockRequest: RequestExtended = {
  id_request: '1',
  id_user: '1',                // Demande faite par mockUser
  id_animal: '1',              // Pour mockAnimal
  status: 'pending',           // En attente de traitement
  message: 'Je souhaite adopter cet animal',
  user: mockUser,              // Utilisateur qui a fait la demande
  animal: mockAnimal           // Animal demandé
}

/**
 * SECTION 6 : MOCKS AVEC RELATIONS COMPLEXES
 * 
 * Pour tester les pages qui affichent des relations entre entités
 */

// Association avec ses animaux (pour la page détails association)
export const mockAssociationExtended: AssociationExtended = {
  ...mockAssociation,
  animals: [mockAnimalExtended] // Liste des animaux gérés
}

// Demande acceptée (pour tester les différents statuts)
export const mockAcceptedRequest: RequestExtended = {
  ...mockRequest,
  id_request: '2',
  status: 'accepted'           // Demande acceptée par l'association
}

// Demande refusée (pour tester les différents statuts)
export const mockRefusedRequest: RequestExtended = {
  ...mockRequest,
  id_request: '3',
  status: 'refused'            // Demande refusée par l'association
}

/**
 * UTILISATION DANS LES TESTS :
 * 
 * // Import des données nécessaires
 * import { mockAnimal, mockUser } from '../../test/mocks/mockData'
 * 
 * // Utilisation dans un test
 * it('should render animal name', () => {
 *   render(<AnimalCard animal={mockAnimal} />)
 *   expect(screen.getByText('Rex')).toBeInTheDocument()
 * })
 * 
 * AVANTAGES :
 * - Données cohérentes dans tous les tests
 * - Pas de duplication (DRY principle)
 * - Facile à modifier (un seul endroit)
 * - Relations complètes entre entités
 * - Couvre tous les cas d'usage (disponible, accueilli, etc.)
 */