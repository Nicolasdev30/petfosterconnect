/**
 * TEST PROVIDERS
 *
 * Composant wrapper qui fournit tous les contextes nécessaires
 * pour les tests de composants React
 */

import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import AuthProvider from '../../contexts/authContext'
import ModalProvider from '../../contexts/modalContext'
import { NotificationProvider } from '../../contexts/NotificationContext'
import AnimalManagementProvider from '../../contexts/animalManagementContext'

interface TestProvidersProps {
  children: ReactNode
}

export default function TestProviders({ children }: TestProvidersProps) {
  return (
    <MemoryRouter>
      <NotificationProvider>
        <AuthProvider>
          <AnimalManagementProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </AnimalManagementProvider>
        </AuthProvider>
      </NotificationProvider>
    </MemoryRouter>
  )
}
