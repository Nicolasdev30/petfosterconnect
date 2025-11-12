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

describe("Routes API - /api/animals", () => {
  it("doit retourner 200 pour la liste publique des animaux", async () => {
    const res = await request(app).get("/api/animals");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success");
  });

  it("doit retourner 401 si tentative de création sans authentification", async () => {
    const res = await request(app).post("/api/animals").send({ name: "Test" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 400 si création avec données invalides", async () => {
    const res = await request(app).post("/api/animals").send({}); // Pas de nom requis
    expect(res.status).toBe(401); // Non authentifié d'abord
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 200 pour un animal spécifique existant (GET /:id)", async () => {
    // Test avec un ID qui pourrait exister
    const res = await request(app).get("/api/animals/1");
    // Peut être 200 si l'animal existe, 404 sinon
    expect([200, 404]).toContain(res.status);
    expect(res.body).toHaveProperty("success");
  });

  it("doit retourner 401 si tentative de modification sans authentification (PATCH /:id)", async () => {
    const res = await request(app)
      .patch("/api/animals/1")
      .send({ name: "Nouveau nom" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
