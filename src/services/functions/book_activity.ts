import {
  ConvertedFunctionParamProps,
  BookActivityProps,
} from "../function-descriptions.js";

export function book_activity(
  args: ConvertedFunctionParamProps<BookActivityProps>
): string {
  const { activity_name, farm_name, datetime, name, email, number_of_people } =
    args;
  return JSON.stringify({
    activity_name,
    farm_name,
    datetime,
    name,
    email,
    number_of_people,
    booking_reference: "ABC123",
  });
}
