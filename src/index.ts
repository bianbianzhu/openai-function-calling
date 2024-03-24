import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {
  StaticPromptMap,
  SystemPromptMap,
  UserPromptMap,
  FunctionPromptMap,
  AssistantPromptMap,
} from "./services/prompt-map.js";
import { userPromptInterface } from "./services/user-prompt-interface.js";
import functionMap from "./services/functions/index.js";
import { isNonEmptyString } from "./utils/type-utils.js";
import { startChat } from "./services/chat.js";
import { isChatEnding } from "./utils/chat-utils.js";

const messages: ChatCompletionMessageParam[] = [];

console.log(StaticPromptMap.welcome);

messages.push(SystemPromptMap.context);

const userInput = await userPromptInterface("You: ");
const userPrompt = UserPromptMap.task(userInput);
messages.push(userPrompt);

async function startWorkFlow(messages: ChatCompletionMessageParam[]) {
  while (!isChatEnding(messages.at(-1))) {
    const result = await startChat(messages);

    if (!result) {
      return console.log(StaticPromptMap.fallback);
    } else if (isNonEmptyString(result)) {
      console.log(`Assistant: ${result}`);
      messages.push(AssistantPromptMap.model_response(result));
      const userInput = await userPromptInterface("You: ");
      const userPrompt = UserPromptMap.task(userInput);
      messages.push(userPrompt);
    } else {
      for (const item of result) {
        const {
          tool_call_id,
          function_name,
          arguments: function_arguments,
        } = item;

        console.log(
          `Calling function "${function_name}" with ${JSON.stringify(
            function_arguments
          )}`
        );

        const function_return =
          functionMap[function_name as keyof typeof functionMap](
            function_arguments
          );

        /** The key is to add the function output back to the messages wit a role of "tool", the id of the tool call and the function return as the content */
        messages.push(
          FunctionPromptMap.function_response({
            tool_call_id,
            content: function_return,
          })
        );
      }
    }
  }

  return console.log(StaticPromptMap.end);
}

await startWorkFlow(messages);
