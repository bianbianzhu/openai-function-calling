import {
  ConvertedFunctionParamProps,
  GetFlightInfoProps,
} from "../function-descriptions.js";

/**
 * This function is a mock for getting flight information from a third-party API.
 * Function name must match the file name.
 * @param location_origin The location of the departure airport. e.g. DUS, see src/services/function-descriptions.ts for more information.
 * @param location_destination The location of the destination airport. e.g. HAM, see src/services/function-descriptions.ts for more information.
 * @returns A JSON string of an `object` with flight information. It must a string as it will be passed back to the model again.
 */
export function get_flight_info<T extends string>(
  args: ConvertedFunctionParamProps<GetFlightInfoProps>
): string {
  const flightInfo = {
    origin: args.location_origin,
    destination: args.location_destination,
    departure_time: "2022-01-01T12:00:00Z",
    arrival_time: "2022-01-01T13:00:00Z",
    airline: "Lufthansa",
    flight_number: "LH123",
  };

  return JSON.stringify(flightInfo);
}
