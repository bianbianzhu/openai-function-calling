export function book_flight(
  loc_origin: string,
  loc_destination: string,
  datetime: string,
  airline: string
) {
  console.log(
    `Flight booked from ${loc_origin} to ${loc_destination} on ${datetime} with ${airline}`
  );
}
