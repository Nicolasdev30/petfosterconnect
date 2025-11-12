import { describe, it, expect } from "vitest";
import Association from "../../../models/Association";

describe("Association model", () => {
  it("devrait créer une instance avec les propriétés principales", () => {
    const association = Association.build({
      name: "Les Amis des Animaux",
      email: "contact@amis-animaux.fr",
      phone: "0123456789",
      address: "12 rue des Animaux, 75000 Paris",
    });
    expect(association).toBeInstanceOf(Association);
    expect(association.name).toBe("Les Amis des Animaux");
    expect(association.email).toBe("contact@amis-animaux.fr");
    expect(association.phone).toBe("0123456789");
    expect(association.address).toBe("12 rue des Animaux, 75000 Paris");
  });
});
