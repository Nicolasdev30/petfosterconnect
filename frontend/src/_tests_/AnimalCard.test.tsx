/**
 * TESTS UNITAIRES - COMPOSANT ANIMALCARD
 *
 * Ce fichier teste le composant AnimalCard qui affiche les informations d'un animal
 * dans une carte (nom, espèce, race, âge, photo, statut).
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AnimalCard from '../components/AnimalCard/AnimalCard'
import TestProviders from './providers/TestProviders'
import { mockAnimal, mockAnimalAccueilli } from './mocks/mockData'

describe('AnimalCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render animal information correctly', () => {
    render(
      <TestProviders>
        <AnimalCard animal={mockAnimal} />
      </TestProviders>
    )

    expect(screen.getByText('Rex')).toBeInTheDocument()
    expect(screen.getByText('Chien')).toBeInTheDocument()
    expect(screen.getByText('Berger Allemand')).toBeInTheDocument()
    expect(screen.getByText('Mâle')).toBeInTheDocument()
    expect(screen.getByText('5 ans')).toBeInTheDocument()
  })

  it('should display animal image with correct alt text', () => {
    render(
      <TestProviders>
        <AnimalCard animal={mockAnimal} />
      </TestProviders>
    )

    const image = screen.getByAltText('Rex')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockAnimal.photo_url)
  })

  it('should show correct status badge', () => {
    render(
      <TestProviders>
        <AnimalCard animal={mockAnimal} />
      </TestProviders>
    )

    const statusBadge = screen.getByText('disponible')
    expect(statusBadge).toBeInTheDocument()
    expect(statusBadge).toHaveClass('status--disponible')
  })

  it('should render link to animal details page', () => {
    render(
      <TestProviders>
        <AnimalCard animal={mockAnimal} />
      </TestProviders>
    )

    const detailsLink = screen.getByText('Voir plus')
    expect(detailsLink).toBeInTheDocument()
    expect(detailsLink.closest('a')).toHaveAttribute('href', '/animal/1')
  })

  it('should handle singular/plural for age display correctly', () => {
    const youngAnimal = {
      ...mockAnimal,
      age: 1,
      id_animal: '999'
    }

    render(
      <TestProviders>
        <AnimalCard animal={youngAnimal} />
      </TestProviders>
    )

    expect(screen.getByText('1 an')).toBeInTheDocument()
  })

  it('should display "accueilli" status correctly', () => {
    render(
      <TestProviders>
        <AnimalCard animal={mockAnimalAccueilli} />
      </TestProviders>
    )

    const statusBadge = screen.getByText('accueilli')
    expect(statusBadge).toBeInTheDocument()
    expect(statusBadge).toHaveClass('status--accueilli')
  })

  it('should handle missing optional fields gracefully', () => {
    const animalWithMissingFields = {
      ...mockAnimal,
      breed: '',
      sex: '',
      description: ''
    }

    render(
      <TestProviders>
        <AnimalCard animal={animalWithMissingFields} />
      </TestProviders>
    )

    expect(screen.getByText('Rex')).toBeInTheDocument()
    expect(screen.getByText('Chien')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(
      <TestProviders>
        <AnimalCard animal={mockAnimal} />
      </TestProviders>
    )

    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
