/**
 * COMPOSANT CARTE DEMANDE D'ACCUEIL
 * 
 * Affichage et gestion des demandes d'adoption :
 * 
 * Informations affichées :
 * - Statut de la demande (pending, accepted, refused)
 * - Photo et détails de l'animal demandé
 * - Informations complètes : nom, espèce, race, sexe, âge
 * 
 * Actions conditionnelles :
 * - Si utilisateur = association : boutons accepter/refuser
 * - Si utilisateur = famille : affichage en lecture seule
 * 
 * Fonctionnalités :
 * - Mise à jour en temps réel des statuts
 * - Gestion des erreurs avec feedback
 * - Interface intuitive avec icônes Font Awesome
 * 
 * Workflow :
 * - Association voit la demande
 * - Clique accepter (✓) ou refuser (✗)
 * - Mise à jour immédiate de l'interface
 * - Synchronisation avec l'état global
 */
import "./RequestCard.scss";

import type { RequestExtended } from "../../types/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/authContext";
import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { RequestService } from "../../services/api/requestService";
import type { AuthUser } from "../../types/user";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const requestService = new RequestService(axios);

interface RequestCardProps {
  request: RequestExtended;
  userData: AuthUser | null;
  setUserData: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

export default function RequestCard({
  request,
  userData,
  setUserData,
}: RequestCardProps) {
  const { user } = useAuth();

  const answerToRequest = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (!userData?.id_association) return;

    const value = event.currentTarget.value;
    const id_request: string = request.id_request;
    const status: string = value;

    try {
      const response = await requestService.answerToRequest(id_request, status);
      console.log(response);

      setUserData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          requests: prev.requests.map((req) =>
            req.id_request === response.data.request.id_request
              ? { ...req, ...response.data.request }
              : req,
          ),
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <article className="request_card">
      <p>{request.status}</p>

      <img
        src={request.animal.photo_url}
        alt={request.animal.name}
        className="request_card_img"
      />

      <section className="request_card_section">
        <p>Nom: {request.animal.name}</p>
        <p>Espèce: {request.animal.species}</p>
        <p>Race: {request.animal.breed}</p>
        <p>Sexe: {request.animal.sex}</p>
        <p>Age: {request.animal.age}</p>
        <p>Status: {request.animal.status}</p>
      </section>

      {user?.role.label === "association" ? (
        <div className="profile_containers_form_buttons">
          <button
            type="button"
            aria-label="Confirm request"
            className="edit button"
            value="accepted"
            onClick={(event) => answerToRequest(event)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button
            type="button"
            aria-label="Refuse request"
            className="close button"
            value="refused"
            onClick={(event) => answerToRequest(event)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      ) : null}
    </article>
  );
}
