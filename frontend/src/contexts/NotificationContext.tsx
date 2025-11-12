/**
 * CONTEXTE DE NOTIFICATIONS TOAST
 * 
 * Système de notifications non-intrusives pour l'UX :
 * - Types : success, error, warning, info
 * - Auto-suppression après délai configurable
 * - Méthodes de commodité (showSuccess, showError, etc.)
 * - Gestion de la pile de notifications
 * 
 * Utilisation typique :
 * - Confirmation d'actions (création, modification)
 * - Affichage d'erreurs utilisateur-friendly
 * - Informations contextuelles
 */
import React, { createContext, useContext, useState, useCallback } from "react";
import type { Notification, NotificationType } from "../types/notification";

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      duration: number = 5000
    ) => {
      const id = generateId();
      const notification: Notification = {
        id,
        type,
        title,
        message,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-suppression après la durée spécifiée
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Méthodes de commodité
  const showSuccess = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification("success", title, message, duration);
    },
    [addNotification]
  );

  const showError = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification("error", title, message, duration);
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification("warning", title, message, duration);
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification("info", title, message, duration);
    },
    [addNotification]
  );

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
