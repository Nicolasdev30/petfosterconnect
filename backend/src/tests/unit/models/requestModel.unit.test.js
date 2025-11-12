import { describe, it, expect } from "vitest";
import Request from "../../../models/Request";

describe("Request model", () => {
  it("devrait créer une instance avec les propriétés principales", () => {
    const request = Request.build({
      status: "pending",
      message: "Je souhaite accueillir Rex.",
      id_user: 1,
      id_animal: 2,
    });
    expect(request).toBeInstanceOf(Request);
    expect(request.status).toBe("pending");
    expect(request.message).toBe("Je souhaite accueillir Rex.");
    expect(request.id_user).toBe(1);
    expect(request.id_animal).toBe(2);
  });
});
