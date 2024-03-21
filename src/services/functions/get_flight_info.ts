/**
 * This function is a mock for getting flight information from a third-party API.
 * Function name must match the file name.
 * @param location_origin The location of the departure airport. e.g. DUS, see src/services/function-descriptions.ts for more information.
 * @param location_destination The location of the destination airport. e.g. HAM, see src/services/function-descriptions.ts for more information.
 */
export function get_flight_info(
  location_origin: string,
  location_destination: string
) {
  const flightInfo = {
    origin: location_origin,
    destination: location_destination,
    departure_time: "2022-01-01T12:00:00Z",
    arrival_time: "2022-01-01T13:00:00Z",
    airline: "Lufthansa",
    flight_number: "LH123",
  };

  return JSON.stringify(flightInfo);
}
