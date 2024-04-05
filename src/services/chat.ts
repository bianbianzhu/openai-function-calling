import OpenAI from "openai";
import { processMessage } from "../utils/chat-utils.js";
import { openai } from "./openai.js";
import { tools } from "./function-descriptions.js";

type ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

export const startChat = async (messages: ChatCompletionMessageParam[]) => {
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
    throw new Error("Error: No response from the API.");
  }

  /**
   * The following code is a MUST for 2 reasons:
   * 1. For `No` tool calls messages (the default case), like the plain text response from `message.content`, it caches the conversation history and make the model 'remember' the context;
   * 2. For tool calls messages (the case when it returns tool_call_id(s), function name(s) and corresponding arguments), the messages must be kept in the conversation history as they are the preceeding messages for the messages with role 'tool'.
   * The messages with role 'tool' is designed to use the returned values from the function(s) which triggered by the tool call(s), and the tool_call_id(s) which indicate which function(s) have been called, to invoke the llm model to generate the response.
   * If not provided, the API will return an error: 400 Invalid parameter: messages with role 'tool' must be a response to a preceeding message with 'tool_calls'.
   * @example
   * [ { role: 'system', content: 'You are an flight booking assistant.' },
   * { role: 'user', content: "When's the next flight from Amsterdam to New York?" },
   * { role: 'assistant', content: null, tool_calls: [ [Object] ] },
   * { role: 'tool', tool_call_id: 'call_n7AyoV7wEea5u1ies6A536pJ', content: '{"origin":"AMS","destination":"JFK","departure_time":"2022-01-01T12:00:00Z" }'} ]
   * @summary the 3rd message is the tool call message, which is the preceeding message for the 4th message with role 'tool'
   */
  messages.push(message);

  return processMessage(message);
};
