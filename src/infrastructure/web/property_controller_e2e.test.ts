import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyService } from "../../application/services/property_service";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { PropertyController } from "./property_controller";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [PropertyEntity, BookingEntity, UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );

  propertyService = new PropertyService(propertyRepository);

  propertyController = new PropertyController(propertyService);

  app.post("/properties", (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("PropertyController", () => {
  beforeAll(async () => {
    const propertyRepo = dataSource.getRepository(PropertyEntity);

    await propertyRepo.clear();

    await propertyRepo.save({
      id: "1",
      name: "Propriedade Teste",
      description: "Um teste",
      maxGuests: 50,
      basePricePerNight: 5000,
    });
  });

  it("deve criar uma propriedade com sucesso", async () => {
    const response = await request(app).post("/properties").send({
      name: "Castelo",
      description: "Um castelo grande",
      maxGuests: 20,
      basePricePerNight: 2000,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Property created successfully");
    expect(response.body.property).toHaveProperty("id");
    expect(response.body.property).toHaveProperty("name");
    expect(response.body.property).toHaveProperty("description");
    expect(response.body.property).toHaveProperty("maxGuests");
    expect(response.body.property).toHaveProperty("basePricePerNight");
  });
});
