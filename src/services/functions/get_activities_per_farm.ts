import {
  ConvertedFunctionParamProps,
  GetActivitiesPerFarmProps,
} from "../function-descriptions.js";

export function get_activities_per_farm(
  args: ConvertedFunctionParamProps<GetActivitiesPerFarmProps>
): string {
  const { farm_name } = args;
  return JSON.stringify({
    farm_name,
    activities: [
      {
        name: "Activity 1",
        description: "Description 1",
        price: 100,
      },
      {
        name: "Activity 2",
        description: "Description 2",
        price: 200,
      },
      {
        name: "Activity 3",
        description: "Description 3",
        price: 300,
      },
    ],
  });
}
