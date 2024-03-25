import {
  ConvertedFunctionParamProps,
  GetFarmsProps,
} from "../function-descriptions.js";

export async function get_farms(
  args: ConvertedFunctionParamProps<GetFarmsProps>
): Promise<string> {
  const { location } = args;
  return JSON.stringify({
    location,
    farms: [
      {
        name: "Farm 1",
        location: "Location 1",
        rating: 4.5,
        products: ["product 1", "product 2"],
        activities: ["activity 1", "activity 2"],
      },
      {
        name: "Farm 2",
        location: "Location 2",
        rating: 3.5,
        products: ["product 3", "product 4"],
        activities: ["activity 3", "activity 4"],
      },
      {
        name: "Farm 3",
        location: "Location 3",
        rating: 5,
        products: ["product 5", "product 6"],
        activities: ["activity 5", "activity 6"],
      },
    ],
  });
}
