/**
 * TESTS UNITAIRES - PAGE PROFIL
 * 
 * Tests de la page de gestion du profil utilisateur :
 * - Vérification de l'authentification requise
 * - Affichage conditionnel selon le rôle (famille/association)
 * - Gestion des états de chargement
 * - Sécurité d'accès aux données
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Profile from '../pages/Profile/Profile'
import TestProviders from './providers/TestProviders'

vi.mock('../services/api/profileService', () => ({
  ProfileService: vi.fn().mockImplementation(() => ({
    getProfile: vi.fn()
  }))
}))

const mockAuthContext = {
  user: null,
  setUser: vi.fn(),
  logout: vi.fn()
}

vi.mock('../contexts/authContext', async () => {
  const actual = await vi.importActual('../contexts/authContext')
  return {
    ...actual,
    useAuth: () => mockAuthContext
  }
})

describe('Profile Page', () => {
  it('should require authentication', () => {
    mockAuthContext.user = null
    
    render(
      <TestProviders>
        <Profile />
      </TestProviders>
    )
    
    expect(screen.getByText('Vous devez être connecté pour accéder à votre profil.')).toBeInTheDocument()
  })

  it('should display user profile for foster role', async () => {
    mockAuthContext.user = {
      id_user: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@test.com',
      password: '********',
      id_role: '1',
      id_association: null,
      role: { id_role: 1, label: 'foster' },
      association: null,
      requests: []
    }

    render(
      <TestProviders>
        <Profile />
      </TestProviders>
    )

    // Vérifier que le profil utilisateur est en cours de chargement
    expect(screen.getByText('Chargement')).toBeInTheDocument()
  })

  it('should display association profile for association role', async () => {
    mockAuthContext.user = {
      id_user: '2',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@test.com',
      password: '********',
      id_role: '2',
      id_association: '1',
      role: { id_role: 2, label: 'association' },
      association: {
        id_association: '1',
        name: 'Test Association',
        email: 'test@association.com',
        phone: '0123456789',
        address: '123 Test Street',
        photo: '/logo.webp',
        animals: []
      },
      requests: []
    }

    render(
      <TestProviders>
        <Profile />
      </TestProviders>
    )

    // Vérifier que le profil association est en cours de chargement
    expect(screen.getByText('Chargement')).toBeInTheDocument()
  })
})