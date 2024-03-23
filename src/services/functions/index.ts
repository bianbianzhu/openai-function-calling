import { DescribedFunctionName } from "../function-descriptions.js";
import { book_flight } from "./book_flight.js";
import { file_complaint } from "./file_complaint.js";
import { get_flight_info } from "./get_flight_info.js";

export default {
  get_flight_info,
  file_complaint,
  book_flight,
} satisfies Record<DescribedFunctionName, (...args: any[]) => string | void>;
