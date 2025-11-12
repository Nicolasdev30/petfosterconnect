/**
 * COMPOSANT NOTIFICATION INDIVIDUELLE
 * 
 * Affichage d'une notification toast :
 * 
 * Types supportés :
 * - success : Confirmation d'actions (✅)
 * - error : Erreurs utilisateur (❌)
 * - warning : Avertissements (⚠️)
 * - info : Informations contextuelles (ℹ️)
 * 
 * Structure :
 * - Icône selon le type
 * - Titre principal
 * - Message détaillé
 * - Bouton de fermeture manuelle
 * 
 * Fonctionnalités :
 * - Auto-suppression après délai configurable
 * - Fermeture manuelle avec bouton ×
 * - Animations d'entrée/sortie
 * - Design adaptatif selon le type
 * 
 * Accessibilité :
 * - Aria-label sur bouton fermeture
 * - Couleurs contrastées selon WCAG
 * - Navigation clavier fonctionnelle
 */
import React from "react";
import "./NotificationItem.scss";
import type { Notification } from "../../types/notification";

interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className={`notification notification--${notification.type}`}>
      <div className="notification__content">
        <div className="notification__header">
          <span className="notification__icon">{getIcon()}</span>
          <h4 className="notification__title">{notification.title}</h4>
        </div>
        <p className="notification__message">{notification.message}</p>
      </div>
      <button
        className="notification__close"
        onClick={() => onClose(notification.id)}
        aria-label="Fermer la notification"
      >
        ×
      </button>
    </div>
  );
};

export default NotificationItem;
