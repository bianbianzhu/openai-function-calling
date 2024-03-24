import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionToolMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs";

type UserPromptMapKey = "task";
type SystemPromptMapKey = "context";
type FunctionPromptMapKey = "function_response";
type AssistantPromptMapKey = "model_response";
/** even without an argument, the type won't give error (think about the `index` and `array` parameters in any array callback methods) */
type UserPromptMapValue = (
  userInput?: string
) => ChatCompletionUserMessageParam;
type FunctionPromptMapValue = (
  args: Omit<ChatCompletionToolMessageParam, "role">
) => ChatCompletionToolMessageParam;
type AssistantPromptMapValue = (
  modelResponse: string
) => ChatCompletionAssistantMessageParam;

export const StaticPromptMap = {
  welcome:
    "Welcome to the flight booking assistant! What can I help you with today?",
  fallback: "I'm sorry, I don't understand.",
  end: "I hope I was able to help you. Goodbye!",
} as const;

export const SystemPromptMap: Record<
  SystemPromptMapKey,
  ChatCompletionSystemMessageParam
> = {
  context: {
    role: "system",
    content: "You are an flight booking assistant.",
  },
};

export const UserPromptMap: Record<UserPromptMapKey, UserPromptMapValue> = {
  task: (userInput) => ({
    role: "user",
    // use || instead of ?? to give a default value when userInput is an empty string
    content: userInput || "What can you do?",
  }),
};

export const FunctionPromptMap: Record<
  FunctionPromptMapKey,
  FunctionPromptMapValue
> = {
  function_response: ({ tool_call_id, content }) => ({
    role: "tool",
    tool_call_id,
    content,
  }),
};

export const AssistantPromptMap: Record<
  AssistantPromptMapKey,
  AssistantPromptMapValue
> = {
  model_response: (modelResponse) => ({
    role: "assistant",
    content: modelResponse,
  }),
};
