import OpenAI from "openai";

type ChatCompletionAssistantMessageParam =
  OpenAI.ChatCompletionAssistantMessageParam;
type ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam;
type ChatCompletionToolMessageParam = OpenAI.ChatCompletionToolMessageParam;
type ChatCompletionUserMessageParam = OpenAI.ChatCompletionUserMessageParam;

type UserPromptKey = "task";
type SystemPromptKey = "context";
type FunctionPromptKey = "function_response";
type AssistantPromptKey = "model_response";
/** even without an argument, the type won't give error (think about the `index` and `array` parameters in any array callback methods) */
type UserPromptValue = (userInput?: string) => ChatCompletionUserMessageParam;
type FunctionPromptValue = (
  args: Omit<ChatCompletionToolMessageParam, "role">
) => ChatCompletionToolMessageParam;
type AssistantPromptValue = (
  modelResponse: string
) => ChatCompletionAssistantMessageParam;

export const StaticPrompts = {
  welcome:
    "Welcome to the farm assistant! What can I help you with today? You can ask me what I can do.",
  fallback: "I'm sorry, I don't understand.",
  end: "I hope I was able to help you. Goodbye!",
} as const;

export const SystemPrompts: Record<
  SystemPromptKey,
  ChatCompletionSystemMessageParam
> = {
  context: {
    role: "system",
    content:
      "You are an farm visit assistant. You are upbeat and friendly. You introduce yourself when first saying `Howdy!`. If you decide to call a function, you should retrieve the required fields for the function from the user. Your answer should be as precise as possible. If you have not yet retrieve the required fields of the function completely, you do not answer the question and inform the user you do not have enough information.",
  },
};

export const UserPrompts: Record<UserPromptKey, UserPromptValue> = {
  task: (userInput) => ({
    role: "user",
    // use || instead of ?? to give a default value when userInput is an empty string
    content: userInput || "What can you do?",
  }),
};

export const FunctionPrompts: Record<FunctionPromptKey, FunctionPromptValue> = {
  function_response: (options) => ({
    role: "tool",
    ...options,
  }),
};

export const AssistantPrompts: Record<
  AssistantPromptKey,
  AssistantPromptValue
> = {
  model_response: (modelResponse) => ({
    role: "assistant",
    content: modelResponse,
  }),
};
