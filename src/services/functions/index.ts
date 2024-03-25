import { DescribedFunctionName } from "../function-descriptions.js";
import { book_activity } from "./book_activity.js";
import { file_complaint } from "./file_complaint.js";
import { get_activities_per_farm } from "./get_activities_per_farm.js";
import { get_farms } from "./get_farms.js";

export default {
  file_complaint,
  get_farms,
  get_activities_per_farm,
  book_activity,
} satisfies Record<DescribedFunctionName, (...args: any[]) => Promise<string>>;
