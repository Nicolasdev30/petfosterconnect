import request from "supertest";
import { describe, it, expect } from "vitest";
import express from "express";
import routes from "../../../../src/routes/index.js";
import {
  errorHandler,
  notFound,
} from "../../../../src/middlewares/errorHandler.js";

const app = express();
app.use(express.json());
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

describe("Routes API - /api/requests", () => {
  it("doit retourner 500 pour une route inexistante (middleware d'erreur)", async () => {
    const res = await request(app).get("/api/requests");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si tentative d'accès aux demandes utilisateur sans authentification", async () => {
    const res = await request(app).get("/api/requests/user");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si tentative de création sans authentification", async () => {
    const res = await request(app).post("/api/requests").send({ id_animal: 1 });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si tentative d'accès aux demandes reçues sans authentification", async () => {
    const res = await request(app).get("/api/requests/received");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si tentative d'accès à une demande spécifique sans authentification", async () => {
    const res = await request(app).get("/api/requests/1");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si tentative de modification de statut sans authentification", async () => {
    const res = await request(app)
      .patch("/api/requests/1")
      .send({ status: "accepted" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si modification avec statut invalide (authentification d'abord)", async () => {
    const res = await request(app)
      .patch("/api/requests/1")
      .send({ status: "invalid_status" });
    expect(res.status).toBe(401); // Auth d'abord, puis validation
    expect(res.body).toHaveProperty("message");
  });
});
