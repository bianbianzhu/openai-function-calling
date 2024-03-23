import {
  ChatCompletionTool,
  FunctionDefinition,
} from "openai/resources/index.mjs";

export enum DescribedFunctionName {
  GetFlightInfo = "get_flight_info",
  BookFlight = "book_flight",
  FileComplaint = "file_complaint",
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
  {
    name: DescribedFunctionName.BookFlight,
    description: "Book a flight based on flight information",
    parameters: {
      type: "object",
      properties: {
        loc_origin: {
          type: "string",
          description: "The departure airport, e.g. DUS",
        },
        loc_destination: {
          type: "string",
          description: "The destination airport, e.g. HAM",
        },
        datetime: {
          type: "string",
          description: "The date and time of the flight, e.g. 2023-01-01 01:01",
        },
        airline: {
          type: "string",
          description: "The service airline, e.g. Lufthansa",
        },
      },
      required: ["loc_origin", "loc_destination", "datetime", "airline"],
    },
  },
  {
    name: DescribedFunctionName.FileComplaint,
    description: "File a complaint as a customer",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the user, e.g. John Doe",
        },
        email: {
          type: "string",
          description: "The email address of the user, e.g. john@doe.com",
        },
        text: {
          type: "string",
          description: "Description of issue",
        },
      },
      required: ["name", "email", "text"],
    },
  },
];

export const tools = functionDescriptions.map<ChatCompletionTool>(
  (description) => ({
    type: "function",
    function: description,
  })
);
