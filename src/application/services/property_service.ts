import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";
import { CreatePropertyDTO } from "../dtos/create_property_dto";
import { v4 as uuidv4 } from "uuid";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }

  async createProperty(dto: CreatePropertyDTO): Promise<Property | null> {
    if (!dto.name) {
      throw new Error("O campo nome é obrigatório.");
    }

    if (dto.maxGuests <= 0) {
      throw new Error("A capacidade máxima deve ser maior que zero.");
    }

    if (!dto.basePricePerNight) {
      throw new Error("O preço base por noite é obrigatório.");
    }

    const property = new Property(
      uuidv4(),
      dto.name,
      dto.description,
      dto.maxGuests,
      dto.basePricePerNight
    );

    await this.propertyRepository.save(property);

    return property;
  }
}
