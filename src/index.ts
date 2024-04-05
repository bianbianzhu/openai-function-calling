import OpenAI from "openai";
import {
  StaticPrompts,
  SystemPrompts,
  FunctionPrompts,
} from "./services/prompts.js";
import { createUserMessage } from "./services/user-prompt-interface.js";
import AvailableFunctions from "./services/functions/index.js";
import { isNonEmptyString } from "./utils/type-utils.js";
import { startChat } from "./services/chat.js";
import { isChatEnding } from "./utils/chat-utils.js";

type ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

async function startWorkFlow() {
  const messages: ChatCompletionMessageParam[] = [];

  console.log(StaticPrompts.welcome);

  messages.push(SystemPrompts.context);

  const userPrompt = await createUserMessage();
  messages.push(userPrompt);

  while (!isChatEnding(messages.at(-1))) {
    const result = await startChat(messages);

    //TODO: extract this if block to a function
    if (!result) {
      console.log(StaticPrompts.fallback);
    } else if (isNonEmptyString(result)) {
      console.log(`Assistant: ${result}`);

      const userPrompt = await createUserMessage();
      messages.push(userPrompt);
    } else {
      //Warning: Use for loop instead of Promise.all to ensure the order of the messages; but can be optimized if multiple function calls are independent and parallelisable
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

        const functionReturn = await AvailableFunctions[
          function_name as keyof typeof AvailableFunctions
        ](function_arguments);

        /** The key is to add the function output back to the messages wit a role of "tool", the id of the tool call and the function return as the content */
        messages.push(
          FunctionPrompts.function_response({
            tool_call_id,
            content: functionReturn,
          })
        );
      }
    }
  }

  console.log(StaticPrompts.end);
}

await startWorkFlow();
