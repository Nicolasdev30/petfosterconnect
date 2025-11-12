/**
 * TESTS UNITAIRES - PAGE D'ACCUEIL
 * 
 * Tests de la page principale de l'application pour valider :
 * - Affichage correct du contenu principal
 * - Présence des liens de navigation
 * - Structure sémantique appropriée
 * - Accessibilité et responsive design
 * 
 * Ces tests garantissent que la page d'accueil fonctionne
 * correctement et guide les utilisateurs vers les fonctionnalités.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../pages/Home/Home'
import TestProviders from './providers/TestProviders'

describe('Home Page', () => {
  it('should render main heading and tagline', () => {
    render(
      <TestProviders>
        <Home />
      </TestProviders>
    )
    
    // Vérifier la présence du slogan principal
    expect(screen.getByText('Ensemble, offrons une famille aux animaux dans le besoin')).toBeInTheDocument()
  })

  it('should display navigation links to main features', () => {
    render(
      <TestProviders>
        <Home />
      </TestProviders>
    )
    
    // Vérifier les liens vers les fonctionnalités principales
    expect(screen.getByText('Voir les animaux à acceuillir')).toBeInTheDocument()
    expect(screen.getByText('Voir les associations')).toBeInTheDocument()
  })

  it('should show "Comment ça marche" section', () => {
    render(
      <TestProviders>
        <Home />
      </TestProviders>
    )
    
    // Vérifier la section explicative
    expect(screen.getByText('Comment ça marche ?')).toBeInTheDocument()
    expect(screen.getByText('Inscription')).toBeInTheDocument()
    expect(screen.getByText('Recherche d\'animal')).toBeInTheDocument()
    expect(screen.getByText('Demande d\'acceuil')).toBeInTheDocument()
  })

  it('should display values section', () => {
    render(
      <TestProviders>
        <Home />
      </TestProviders>
    )
    
    // Vérifier la section des valeurs
    expect(screen.getByText('Nos valeurs')).toBeInTheDocument()
    expect(screen.getByText('Bienveillance')).toBeInTheDocument()
    expect(screen.getByText('Confiance')).toBeInTheDocument()
    expect(screen.getByText('Accessibilité')).toBeInTheDocument()
  })

  it('should have proper semantic structure', () => {
    render(
      <TestProviders>
        <Home />
      </TestProviders>
    )
    
    // Vérifier la structure sémantique
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
  })
})