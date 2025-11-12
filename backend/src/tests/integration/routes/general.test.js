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

describe("Routes API - Routes générales", () => {
  it("doit retourner 200 et les informations de l'API sur GET /api", async () => {
    const res = await request(app).get("/api");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("version");
    expect(res.body).toHaveProperty("endpoints");
  });

  it("doit retourner 200 pour le health check sur GET /api/health", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("timestamp");
    expect(res.body).toHaveProperty("version");
  });
});
