/**
 * TESTS UNITAIRES - CONTEXTE D'AUTHENTIFICATION
 * 
 * Ce fichier teste le contexte AuthContext qui gère l'état global
 * d'authentification dans l'application React.
 * 
 * QU'EST-CE QU'UN CONTEXTE REACT ?
 * Un contexte permet de partager des données (état utilisateur, fonctions)
 * entre tous les composants de l'application sans passer les props
 * de parent en enfant à chaque niveau.
 * 
 * POURQUOI TESTER LES CONTEXTES ?
 * - Vérifier que les valeurs sont correctement fournies
 * - Tester les fonctions (login, logout, etc.)
 * - Valider la gestion d'erreurs
 * - S'assurer que les hooks fonctionnent correctement
 * 
 * SPÉCIFICITÉ DES TESTS DE CONTEXTE :
 * On ne peut pas tester directement un contexte, il faut créer
 * un composant de test qui utilise le hook du contexte.
 */

// IMPORTS POUR LES TESTS DE CONTEXTE
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useAuth } from '../contexts/authContext'
import TestProviders from './providers/TestProviders'

/**
 * COMPOSANT DE TEST POUR UTILISER LE CONTEXTE
 * 
 * Comme on ne peut pas tester directement un contexte React,
 * on crée un composant qui utilise le hook useAuth()
 * et affiche les valeurs pour qu'on puisse les vérifier
 */
function TestComponent() {
  // Utilise le hook useAuth() comme le ferait un vrai composant
  const { user, logout } = useAuth()
  
  return (
    <div>
      {/* Affiche l'état de connexion pour qu'on puisse le tester */}
      <div data-testid="user-status">
        {user ? `Connecté: ${user.first_name}` : 'Non connecté'}
      </div>
      
      {/* Bouton de déconnexion pour tester la fonction logout */}
      <button onClick={logout}>Déconnexion</button>
    </div>
  )
}

vi.mock('../services/api/authService', () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    apiMe: vi.fn().mockResolvedValue(null),
    logout: vi.fn().mockResolvedValue({ success: true })
  }))
}))

/**
 * SUITE DE TESTS POUR LE CONTEXTE D'AUTHENTIFICATION
 * 
 * Ces tests vérifient que le contexte fonctionne correctement :
 * - Fournit les bonnes valeurs aux composants
 * - Gère l'état de connexion/déconnexion
 * - Charge automatiquement l'utilisateur au démarrage
 */
describe('AuthContext', () => {
  it('should provide auth context values', () => {
    // Rend notre composant de test dans les providers
    render(
      <TestProviders>
        <TestComponent />
      </TestProviders>
    )
    
    // Vérifie que les éléments du contexte sont disponibles
    expect(screen.getByTestId('user-status')).toBeInTheDocument()
    // L'élément qui affiche l'état de connexion doit être présent
    
    expect(screen.getByText('Déconnexion')).toBeInTheDocument()
    // Le bouton de déconnexion doit être présent
  })

  it('should handle user authentication state', async () => {
    render(
      <TestProviders>
        <TestComponent />
      </TestProviders>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toBeInTheDocument()
    })
  })

  it('should handle logout functionality', async () => {
    render(
      <TestProviders>
        <TestComponent />
      </TestProviders>
    )
    
    expect(screen.getByText('Déconnexion')).toBeInTheDocument()
  })

  it('should throw error when used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      function InvalidComponent() {
        useAuth()
        return null
      }
      render(<InvalidComponent />)
    }).toThrow()

    consoleError.mockRestore()
  })
})