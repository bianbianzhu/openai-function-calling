import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { openai } from "./services/openai.js";
import { UserPromptMap } from "./services/prompt-map.js";
import { userPromptInterface } from "./services/user-prompt-interface.js";
import { tools } from "./services/function-descriptions.js";
import { isChatEnding, processMessage } from "./utils/chat-utils.js";
import functionMap from "./services/functions/index.js";

const messages: ChatCompletionMessageParam[] = [];

console.log(
  "Welcome to the flight booking assistant! What can I help you with today?"
);

messages.push(UserPromptMap.context());

const userInput = await userPromptInterface("You: ");
const userPrompt = UserPromptMap.task(userInput);
messages.push(userPrompt);

const startChat = async (messages: ChatCompletionMessageParam[]) => {
  const lastMessage = messages.at(-1);

  if (!lastMessage) {
    return "I'm sorry, I don't understand.";
  }

  if (isChatEnding(lastMessage)) {
    return "ABC, Goodbye!";
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    top_p: 0.95,
    temperature: 0.5,
    messages,
    max_tokens: 1024,
    tools,
    tool_choice: "auto",
  });

  const { message } = response.choices[0] ?? {};

  if (!message) {
    return "Error: No response from the API.";
  }

  return processMessage(message);
};

const result = await startChat(messages);

if (!result) {
  console.log("Sorry, I did not understand that. Please try again.");
} else if (typeof result === "string") {
  console.log(result);
} else {
  console.log(result.function_name);

  const info = functionMap[result.function_name as keyof typeof functionMap](
    result.arguments
  );
  console.log(info);
  messages.push({
    role: "function",
    name: result.function_name,
    content: info,
  });
  const response = await startChat(messages);
  console.log(response);
}

// add function result to the prompt for a final answer

// The key is to add the function output back to the messages wit a role of "function" and the content as the output
