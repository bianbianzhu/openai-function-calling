import OpenAI from "openai";
import {
  ConvertTypeNameStringLiteralToType,
  JsonAcceptable,
} from "../utils/type-utils.js";

type ChatCompletionTool = OpenAI.ChatCompletionTool;
type FunctionDefinition = OpenAI.FunctionDefinition;

/**
 * To add a new function description and its corresponding function, follow the steps below:
 * 1. Add a new enum value to DescribedFunctionName, e.g. DoNewThings
 * 2. Add Props type for the function parameters, e.g. DoNewThingsProps
 * 3. Add a new entry to FunctionDescription object
 * 4. Create a new function with the same name as the enum value under the function folder
 */
export enum DescribedFunctionName {
  FileComplaint = "file_complaint",
  getFarms = "get_farms",
  getActivitiesPerFarm = "get_activities_per_farm",
  bookActivity = "book_activity",
}

type FunctionParametersNarrowed<
  T extends Record<string, PropBase<JsonAcceptable>>
> = {
  type: JsonAcceptable;
  properties: T;
  required: (keyof T)[];
};

type PropBase<T extends JsonAcceptable = "string"> = {
  type: T;
  description: string;
};

export type ConvertedFunctionParamProps<
  Props extends Record<string, PropBase<JsonAcceptable>>
> = {
  [K in keyof Props]: ConvertTypeNameStringLiteralToType<Props[K]["type"]>;
};

export type FileComplaintProps = {
  name: PropBase;
  email: PropBase;
  text: PropBase;
};

export type GetFarmsProps = {
  location: PropBase;
};

export type GetActivitiesPerFarmProps = {
  farm_name: PropBase;
};

export type BookActivityProps = {
  farm_name: PropBase;
  activity_name: PropBase;
  datetime: PropBase;
  name: PropBase;
  email: PropBase;
  number_of_people: PropBase<"number">;
};

// The use of satisfies is a workaround for TypeScript as the type of parameters is simply Record<string, unknown>
const FunctionDescriptions: Record<DescribedFunctionName, FunctionDefinition> =
  {
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
    [DescribedFunctionName.getFarms]: {
      name: DescribedFunctionName.getFarms,
      description: "Get the information of farms based on the location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The location of the farm, e.g. Melbourne VIC",
          },
        },
        required: ["location"],
      } satisfies FunctionParametersNarrowed<GetFarmsProps>,
    },
    [DescribedFunctionName.getActivitiesPerFarm]: {
      name: DescribedFunctionName.getActivitiesPerFarm,
      description: "Get the activities available on a farm",
      parameters: {
        type: "object",
        properties: {
          farm_name: {
            type: "string",
            description:
              "The name of the farm, e.g. Collingwood Children's Farm",
          },
        },
        required: ["farm_name"],
      } satisfies FunctionParametersNarrowed<GetActivitiesPerFarmProps>,
    },
    [DescribedFunctionName.bookActivity]: {
      name: DescribedFunctionName.bookActivity,
      description: "Book an activity on a farm",
      parameters: {
        type: "object",
        properties: {
          farm_name: {
            type: "string",
            description:
              "The name of the farm, e.g. Collingwood Children's Farm",
          },
          activity_name: {
            type: "string",
            description: "The name of the activity, e.g. Goat Feeding",
          },
          datetime: {
            type: "string",
            description: "The date and time of the activity",
          },
          name: {
            type: "string",
            description: "The name of the user",
          },
          email: {
            type: "string",
            description: "The email address of the user",
          },
          number_of_people: {
            type: "number",
            description: "The number of people attending the activity",
          },
        },
        required: [
          "farm_name",
          "activity_name",
          "datetime",
          "name",
          "email",
          "number_of_people",
        ],
      } satisfies FunctionParametersNarrowed<BookActivityProps>,
    },
  };

export const tools = Object.values(
  FunctionDescriptions
).map<ChatCompletionTool>((description) => ({
  type: "function",
  function: description,
}));
