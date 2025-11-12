/**
 * COMPOSANT PRINCIPAL DE L'APPLICATION
 * 
 * Gère le routage principal de l'application SPA avec React Router.
 * Structure :
 * - ModalsManager : Gestion centralisée de toutes les modales
 * - Header : Navigation principale avec authentification
 * - Routes : Définition de toutes les pages accessibles
 * - Footer : Pied de page avec liens utiles
 * - NotificationContainer : Affichage des notifications toast
 * 
 * Routes publiques : /, /animals, /associations, /about, /CGU, /policies
 * Routes privées : /profile
 * Routes dynamiques : /animal/:id, /association/:id
 */
import "./App.scss";

import { Route, Routes } from "react-router-dom";

import Header from "./Header/Header";
import ModalsManager from "./modals/ModalsManager";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Footer from "./Footer/Footer";
import NotFound from "../pages/NotFound/NotFound";
import AnimalsList from "../pages/AnimalsList/AnimalsList";
import AnimalDetails from "../pages/AnimalDetails/AnimalDetails";
import AssociationsList from "../pages/AssociationsList/AssociationsList";
import AssociationDetails from "../pages/AssociationsDetails/AssociationDetails";
import CGU from "../pages/CGU/CGU";
import Policies from "../pages/Policies/Policies";
import Profile from "../pages/Profile/Profile";
import AnimalsManagement from "../pages/AnimalsManagement/AnimalsManagement";
import NotificationContainer from "./Notification/NotificationContainer";

export default function App() {
  return (
    <div className="app_container">
      <ModalsManager />
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/manage-animals" element={<AnimalsManagement />}></Route>
        <Route path="/animals" element={<AnimalsList />}></Route>
        <Route path="/animal/:id" element={<AnimalDetails />}></Route>
        <Route path="/associations" element={<AssociationsList />}></Route>
        <Route path="/association/:id" element={<AssociationDetails />}></Route>
        <Route path="/policies" element={<Policies />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/CGU" element={<CGU />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <Footer />
      <NotificationContainer />
    </div>
  );
}
