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

describe("Routes API - /api/auth", () => {
  it("doit retourner 400 si login sans email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "testpass" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 400 si login sans mot de passe", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 400 si login avec email au mauvais format", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "notanemail", password: "testpass" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si login avec email et mot de passe invalides", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "inexistant@example.com", password: "wrongpass" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  // Register sans email
  it("doit retourner 400 si register sans email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      first_name: "Test",
      last_name: "User",
      password: "TestPass123",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  // Register sans mot de passe
  it("doit retourner 400 si register sans mot de passe", async () => {
    const res = await request(app).post("/api/auth/register").send({
      first_name: "Test",
      last_name: "User",
      email: "newuser@example.com",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  // Register sans first_name
  it("doit retourner 400 si register sans prénom", async () => {
    const res = await request(app).post("/api/auth/register").send({
      last_name: "User",
      email: "newuser@example.com",
      password: "TestPass123",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  // Register sans last_name
  it("doit retourner 400 si register sans nom", async () => {
    const res = await request(app).post("/api/auth/register").send({
      first_name: "Test",
      email: "newuser@example.com",
      password: "TestPass123",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  // Tests des routes authentifiées
  it("doit retourner 401 si accès au profil sans authentification", async () => {
    const res = await request(app).get("/api/auth/profile");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si tentative de logout sans authentification", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si tentative de changement de rôle sans authentification", async () => {
    const res = await request(app)
      .post("/api/auth/switch-role")
      .send({ role: "foster" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("doit retourner 401 si changement de rôle avec rôle invalide (authentification d'abord)", async () => {
    const res = await request(app)
      .post("/api/auth/switch-role")
      .send({ role: "invalid_role" });
    expect(res.status).toBe(401); // Auth d'abord, puis validation
    expect(res.body).toHaveProperty("message");
  });
});
