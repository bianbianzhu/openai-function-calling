import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { openai } from "./services/openai.js";
import { UserPromptMap } from "./services/prompt-map.js";
import { userPromptInterface } from "./services/user-prompt-interface.js";
import { tools } from "./services/function-descriptions.js";
import { isNonEmptyString } from "./utils/type-utils.js";

const messages: ChatCompletionMessageParam[] = [];

const userInput = await userPromptInterface("What can I help you with today? ");
const userPrompt = UserPromptMap.task(userInput);
messages.push(userPrompt);

const startChat = async (messages: ChatCompletionMessageParam[]) => {
  const lastMessage = messages.at(-1);

  // if (lastMessage?.role === "user" && lastMessage?.content.includes()) {

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    top_p: 0.95,
    temperature: 0.5,
    messages,
    max_tokens: 1024,
    tools,
    tool_choice: "auto",
  });

  return (
    response.choices[0]?.message.tool_calls?.[0]?.function ??
    response.choices[0]?.message.content ??
    "I'm sorry, I don't understand."
  );
};

const result = await startChat(messages);
console.log(result);
