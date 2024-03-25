import { BookFlightProps } from "../../function-descriptions-flight-assistant.js";
import { ConvertedFunctionParamProps } from "../../function-descriptions.js";

export async function book_flight(
  args: ConvertedFunctionParamProps<BookFlightProps>
): Promise<string> {
  const {
    location_origin,
    location_destination,
    datetime,
    airline,
    name,
    passport,
  } = args;
  return JSON.stringify({
    location_origin,
    location_destination,
    datetime,
    airline,
    name,
    passport,
    booking_reference: "ABC123",
    seat: "12A",
  });
}
