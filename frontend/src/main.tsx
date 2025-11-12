/**
 * POINT D'ENTRÉE PRINCIPAL DE L'APPLICATION REACT
 *
 * Ce fichier initialise l'application React avec tous les providers nécessaires :
 * - BrowserRouter : Gestion du routage SPA (Single Page Application)
 * - NotificationProvider : Système de notifications toast
 * - AuthProvider : Gestion de l'authentification utilisateur
 * - ModalProvider : Gestion des modales (connexion, inscription, etc.)
 * - AnimalManagementProvider : Gestion CRUD des animaux (édition, suppression)
 *
 * Architecture des providers (ordre important) :
 * BrowserRouter > NotificationProvider > AuthProvider > ModalProvider > AnimalManagementProvider > App
 *
 * POURQUOI CET ORDRE ?
 * 1. BrowserRouter en premier : Tous les autres dépendent du routage
 * 2. NotificationProvider ensuite : Les autres contextes peuvent afficher des notifications
 * 3. AuthProvider : Les données utilisateur sont nécessaires partout
 * 4. ModalProvider : Peut utiliser auth et notifications
 * 5. AnimalManagementProvider : Utilise auth, notifications et modales
 */
import "./assets/styles/_reset.scss";
import "./index.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./components/App";
import AuthProvider from "./contexts/authContext";
import ModalProvider from "./contexts/modalContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import AnimalManagementProvider from "./contexts/animalManagementContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <ModalProvider>
            <AnimalManagementProvider>
              <App />
            </AnimalManagementProvider>
          </ModalProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
