import { BookingMapper } from "./booking_mapper";
import { BookingEntity } from "../entities/booking_entity";
import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { DateRange } from "../../../domain/value_objects/date_range";
import { UserEntity } from "../entities/user_entity";
import { PropertyMapper } from "./property_mapper";
import { PropertyEntity } from "../entities/property_entity";
import { User } from "../../../domain/entities/user";

describe("BookingMapper", () => {
  it("deve converter BookingEntity em Booking corretamente", () => {
    const propertyEntity: PropertyEntity = {
      id: "1",
      name: "Castelo",
      description: "Um Castelo Grande",
      maxGuests: 20,
      basePricePerNight: 200,
      bookings: [],
    };

    const userEntity: UserEntity = { id: "1", name: "Davi" };

    const bookingEntity: BookingEntity = {
      id: "1",
      property: propertyEntity,
      guest: userEntity,
      startDate: new Date(Date.now()),
      endDate: new Date(Date.now() + 20000),
      guestCount: 20,
      totalPrice: 20000,
      status: "CONFIRMED",
    };

    const property = new Property("1", "Davi", "Um Castelo Grande", 20, 200);

    const result = BookingMapper.toDomain(bookingEntity, property);

    expect(result.getGuest()).toEqual(userEntity);
    expect(result.getGuestCount()).toEqual(20);
    expect(result.getId()).toEqual("1");
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
    const propertyEntity: PropertyEntity = {
      id: "1",
      name: "Castelo",
      description: "Um Castelo Grande",
      maxGuests: 20,
      basePricePerNight: 200,
      bookings: [],
    };

    const userEntity: UserEntity = { id: "1", name: "Davi" };

    const bookingEntity: any = {
      id: "1",
      property: propertyEntity,
      guest: userEntity,
      // startDate: new Date(Date.now()),
      // endDate: new Date(Date.now() + 20000),
      guestCount: 20,
      totalPrice: 20000,
      status: "CONFIRMED",
    };

    const property = new Property("1", "Davi", "Um Castelo Grande", 20, 200);

    expect(() => BookingMapper.toDomain(bookingEntity, property)).toThrow(
      "A data de início e término não podem ser iguais."
    );
  });

  it("deve converter Booking para BookingEntity corretamente", () => {
    const property = new Property("1", "Davi", "Um Castelo Grande", 20, 200);

    const user = new User("1", "Davi");

    const dateRange = new DateRange(
      new Date(Date.now()),
      new Date(Date.now() + 20000)
    );

    const booking = new Booking("1", property, user, dateRange, 20);

    const result = BookingMapper.toPersistence(booking);

    expect(result.guest).toEqual(user);
    expect(result.id).toBe('1');
    expect(result.totalPrice).toBe(200);
    expect(result.startDate).toBe(dateRange.getStartDate());
    expect(result.endDate).toBe(dateRange.getEndDate());
  });
});
