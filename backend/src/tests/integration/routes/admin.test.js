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

describe("Routes API - /api/admin", () => {
  it("doit retourner 401 si tentative de suppression d'utilisateur sans authentification", async () => {
    const res = await request(app).delete("/api/admin/users/1");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si tentative de suppression d'association sans authentification", async () => {
    const res = await request(app).delete("/api/admin/associations/1");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si tentative de suppression d'animal sans authentification", async () => {
    const res = await request(app).delete("/api/admin/animals/1");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
