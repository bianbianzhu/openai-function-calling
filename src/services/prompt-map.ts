import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

type UserPromptMapKey = "task" | "context";
/** even without an argument, the type won't give error (think about the `index` and `array` parameters in any array callback methods) */
type UserPromptMapValue = (userInput?: string) => ChatCompletionMessageParam;

export const UserPromptMap: Record<UserPromptMapKey, UserPromptMapValue> = {
  context: () => ({
    role: "system",
    content:
      "You are an flight booking assistant. You can help users find flights between two locations.",
  }),
  task: (userInput) => ({
    role: "user",
    content: userInput || "When's the next flight from Amsterdam to New York?",
  }),
};
