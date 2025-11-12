import { describe, it, expect } from "vitest";
import Role from "../../../models/Role";

describe("Role model", () => {
  it("devrait créer une instance avec le label attendu", () => {
    const role = Role.build({
      label: "admin",
    });
    expect(role).toBeInstanceOf(Role);
    expect(role.label).toBe("admin");
  });
});
