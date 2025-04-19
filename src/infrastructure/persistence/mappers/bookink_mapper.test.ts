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
  it("deve converter BookingEntity em Property corretamente", () => {
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
});
