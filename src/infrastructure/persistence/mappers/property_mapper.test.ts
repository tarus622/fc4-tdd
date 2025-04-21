import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";

describe("PropertyMapper", () => {
  it("deve converter PropertyEntity em Property corretamente", () => {
    const propertyEntity: PropertyEntity = {
      id: "1",
      name: "Castelo",
      description: "Um Castelo Grande",
      maxGuests: 20,
      basePricePerNight: 200,
      bookings: [],
    };

    const property: Property = new Property(
      "1",
      "Castelo",
      "Um Castelo Grande",
      20,
      200
    );

    const result = PropertyMapper.toDomain(propertyEntity);

    expect(result).toEqual(property);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
    const propertyEntity: any = {
      id: "1",
      name: "Castelo",
      description: "Um Castelo Grande",
      maxGuests: 20,
      // basePricePerNight: 200,
      bookings: [],
    };

    expect(() => PropertyMapper.toDomain(propertyEntity)).toThrow(
      "O preço base por noite é obrigatório"
    );
  });

  it("deve converter Property para PropertyEntity corretamente", () => {
    const property: Property = new Property(
      "1",
      "Castelo",
      "Um Castelo Grande",
      20,
      200
    );

    const propertyEntity: Partial<PropertyEntity> = {
      id: "1",
      name: "Castelo",
      description: "Um Castelo Grande",
      maxGuests: 20,
      basePricePerNight: 200,
    };

    const result = PropertyMapper.toPersistence(property);

    expect(result).toEqual(propertyEntity);
  });
});
