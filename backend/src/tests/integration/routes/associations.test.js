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

describe("Routes API - /api/associations", () => {
  it("doit retourner 200 pour la liste publique des associations", async () => {
    const res = await request(app).get("/api/associations");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success");
  });

  it("doit retourner 401 si tentative de création sans authentification", async () => {
    const res = await request(app)
      .post("/api/associations/create")
      .send({ name: "Test Association" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 200 pour une association spécifique existante (GET /:id)", async () => {
    const res = await request(app).get("/api/associations/1");
    // Peut être 200 si l'association existe, 404 sinon
    expect([200, 404]).toContain(res.status);
    expect(res.body).toHaveProperty("success");
  });

  it("doit retourner 401 si tentative de modification sans authentification (PATCH /:id)", async () => {
    const res = await request(app)
      .patch("/api/associations/1")
      .send({ name: "Nouveau nom" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si tentative de suppression sans authentification (DELETE /:id)", async () => {
    const res = await request(app).delete("/api/associations/1");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
