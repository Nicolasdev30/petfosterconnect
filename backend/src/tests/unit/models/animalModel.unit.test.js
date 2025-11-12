import { describe, it, expect } from "vitest";
import Animal from "../../../models/Animal";

describe("Animal model", () => {
  it("devrait créer une instance avec les propriétés attendues", () => {
    const animal = Animal.build({
      name: "Rex",
      species: "Chien",
      age: 5,
      id_association: 1,
    });
    expect(animal).toBeInstanceOf(Animal);
    expect(animal.name).toBe("Rex");
    expect(animal.species).toBe("Chien");
    expect(animal.age).toBe(5);
    expect(animal.status).toBe("disponible");
  });
});
