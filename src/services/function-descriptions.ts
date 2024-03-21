import {
  ChatCompletionTool,
  FunctionDefinition,
} from "openai/resources/index.mjs";

export enum DescribedFunctionName {
  GetFlightInfo = "get_flight_info",
}

const functionDescriptions: FunctionDefinition[] = [
  {
    name: DescribedFunctionName.GetFlightInfo,
    description: "Get information about a flight between two locations.",
    parameters: {
      type: "object",
      properties: {
        location_origin: {
          type: "string",
          description: "The location of the departure airport. e.g. DUS",
        },
        location_destination: {
          type: "string",
          description: "The location of the destination airport. e.g. HAM",
        },
      },
      required: ["location_origin", "location_destination"],
    },
  },
];

export const tools = functionDescriptions.map<ChatCompletionTool>(
  (description) => ({
    type: "function",
    function: description,
  })
);
