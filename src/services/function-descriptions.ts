import {
  ChatCompletionTool,
  FunctionDefinition,
} from "openai/resources/index.mjs";
import {
  ConvertTypeNameStringLiteralToType,
  JsonAcceptable,
} from "../utils/type-utils.js";

export enum DescribedFunctionName {
  GetFlightInfo = "get_flight_info",
  BookFlight = "book_flight",
  FileComplaint = "file_complaint",
}

type FunctionParametersNarrowed<T> = {
  type: JsonAcceptable;
  properties: T;
  required: (keyof T)[];
};

type PropBase<T extends JsonAcceptable = "string"> = {
  type: T;
  description: string;
};

// TODO: fix the typing of any
export type ConvertedFunctionParamProps<Props extends Record<string, any>> = {
  [K in keyof Props]: ConvertTypeNameStringLiteralToType<Props[K]["type"]>;
};

export type GetFlightInfoProps = {
  location_origin: PropBase;
  location_destination: PropBase;
};

export type BookFlightProps = {
  name: PropBase;
  passport: PropBase;
  location_origin: PropBase;
  location_destination: PropBase;
  datetime: PropBase;
  airline: PropBase;
};

export type FileComplaintProps = {
  name: PropBase;
  email: PropBase;
  text: PropBase;
};

// The use of satisfies is a workaround for TypeScript as the type of parameters is simply Record<string, unknown>
const functionDescriptionsMap: Record<
  DescribedFunctionName,
  FunctionDefinition
> = {
  [DescribedFunctionName.GetFlightInfo]: {
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
    } satisfies FunctionParametersNarrowed<GetFlightInfoProps>,
  },
  [DescribedFunctionName.BookFlight]: {
    name: DescribedFunctionName.BookFlight,
    description: "Book a flight based on flight information",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the user, e.g. John Doe",
        },
        passport: {
          type: "string",
          description: "The passport number of the user, e.g. 123456789",
        },
        location_origin: {
          type: "string",
          description: "The departure airport, e.g. DUS",
        },
        location_destination: {
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
      required: [
        "location_origin",
        "location_destination",
        "datetime",
        "airline",
        "name",
        "passport",
      ],
    } satisfies FunctionParametersNarrowed<BookFlightProps>,
  },
  [DescribedFunctionName.FileComplaint]: {
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
    } satisfies FunctionParametersNarrowed<FileComplaintProps>,
  },
};

export const tools = Object.values(
  functionDescriptionsMap
).map<ChatCompletionTool>((description) => ({
  type: "function",
  function: description,
}));
