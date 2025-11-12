/**
 * CONFIGURATION VITEST - VITEST.CONFIG.TS
 * 
 * Ce fichier configure Vitest (le framework de test) pour qu'il puisse
 * tester correctement les composants React de l'application.
 * 
 * VITEST vs JEST :
 * Vitest est plus moderne et rapide que Jest, spécialement conçu
 * pour fonctionner avec Vite (notre build tool).
 * 
 * CONFIGURATION EXPLIQUÉE :
 * - plugins: [react()] : Support des composants React et JSX
 * - environment: 'jsdom' : Simule un navigateur pour les tests
 * - globals: true : describe, it, expect disponibles partout
 * - setupFiles : Fichier exécuté avant tous les tests
 */

/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import { defineConfig } from 'vitest/config'
// Fonction pour créer la configuration Vitest avec TypeScript

import react from '@vitejs/plugin-react'
// Plugin Vite pour supporter React et JSX dans les tests

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/_tests_/providers/setup.tsx'],
  },

  resolve: {
    conditions: ['development', 'browser'],
    alias: {
      react: 'react',
      'react-dom': 'react-dom'
    }
  }
})

/**
 * COMMENT CETTE CONFIGURATION FONCTIONNE ?
 * 
 * 1. DÉMARRAGE DES TESTS :
 *    npm run test → Vitest démarre → Lit ce fichier
 * 
 * 2. CHARGEMENT DU PLUGIN REACT :
 *    plugins: [react()] → Vitest peut compiler les fichiers .tsx
 * 
 * 3. CONFIGURATION DE L'ENVIRONNEMENT :
 *    environment: 'jsdom' → Simule window, document, DOM APIs
 * 
 * 4. EXÉCUTION DU SETUP :
 *    setupFiles: ['./src/test/setup.ts'] → Configure les mocks globaux
 * 
 * 5. EXÉCUTION DES TESTS :
 *    Chaque fichier .test.tsx est exécuté avec cette configuration
 * 
 * POURQUOI JSDOM ?
 * Les composants React ont besoin du DOM pour fonctionner :
 * - render() crée des éléments HTML
 * - screen.getByText() cherche dans le DOM
 * - toBeInTheDocument() vérifie la présence dans le DOM
 * 
 * Sans jsdom, ces opérations échoueraient car Node.js
 * n'a pas de DOM par défaut.
 */