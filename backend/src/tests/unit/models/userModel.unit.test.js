import { describe, it, expect } from "vitest";
import User from "../../../models/User";

describe("User model", () => {
  it("devrait créer une instance avec les propriétés principales", () => {
    const user = User.build({
      first_name: "Alice",
      last_name: "Durand",
      email: "alice@example.com",
      password: "hashedpassword",
      id_role: 1,
    });
    expect(user).toBeInstanceOf(User);
    expect(user.first_name).toBe("Alice");
    expect(user.last_name).toBe("Durand");
    expect(user.email).toBe("alice@example.com");
    expect(user.password).toBe("hashedpassword");
    expect(user.id_role).toBe(1);
    expect(user.id_association).toBeUndefined(); // optionnel
  });
});
