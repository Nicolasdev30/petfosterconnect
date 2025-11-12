/**
 * CONTENEUR DE NOTIFICATIONS TOAST
 * 
 * Affichage des notifications en overlay :
 * 
 * Fonctionnalités :
 * - Positionnement fixe en haut à droite
 * - Pile de notifications avec gestion automatique
 * - Responsive design (pleine largeur sur mobile)
 * - Z-index élevé pour visibilité
 * 
 * Gestion d'état :
 * - Récupération des notifications depuis le contexte
 * - Affichage conditionnel (masqué si vide)
 * - Suppression manuelle ou automatique
 * 
 * UX :
 * - Non-intrusif (pointer-events: none sur conteneur)
 * - Interactions possibles sur notifications individuelles
 * - Animations d'apparition/disparition
 */
import React from "react";
import "./NotificationContainer.scss";
import { useNotification } from "../../contexts/NotificationContext";
import NotificationItem from "./NotificationItem";

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
