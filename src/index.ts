import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { openai } from "./services/openai.js";
import { UserPromptMap } from "./services/prompt-map.js";
import { userPromptInterface } from "./services/user-prompt-interface.js";
import { tools } from "./services/function-descriptions.js";

const messages: ChatCompletionMessageParam[] = [];

const userInput = await userPromptInterface("What can I help you with today?");
const userPrompt = UserPromptMap.task(userInput);
messages.push(userPrompt);

const startChat = async (messages: ChatCompletionMessageParam[]) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    top_p: 0.95,
    temperature: 0.5,
    messages,
    max_tokens: 1024,
    tools,
    tool_choice: "auto",
  });

  console.log(response.choices[0]?.message);

  return response.choices[0]?.message.content ?? "";
};

const result = await startChat(messages);
console.log(result);
