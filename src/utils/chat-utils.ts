import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs";
import { isDefined } from "./common-utils.js";

/**
 * ChatCompletionMessageParam is for API request
 * ChatCompletionMessage is for API response
 */

const CHAT_END_SIGNALS = [
  "bye",
  "goodbye",
  "exit",
  "quit",
  "see you",
  "later",
  "farewell",
  "good night",
  "end chat",
  "close",
  "I'm done",
  "I am done",
  "that's all",
  "finish",
  "stop",
];

/**
 * This function checks if the chat is ending based on the `user` message.
 * It checks if the message contains any of the CHAT_END_SIGNALS
 * @param message - the message from the user
 * @returns true if the chat is ending, false otherwise
 */
export function isChatEnding(message: ChatCompletionMessageParam) {
  if (!isUserMessage(message)) {
    return false;
  }
  // user message must have content according to the type definition
  const { content } = message;
  return CHAT_END_SIGNALS.some((signal) => {
    if (typeof content === "string") {
      return includeSignal(content, signal);
    } else {
      // content has a typeof ChatCompletionContentPart, which can be either ChatCompletionContentPartText or ChatCompletionContentPartImage
      // If user attaches an image to the current message first, we assume they are not ending the chat
      const contentPart = content.at(0);
      if (contentPart?.type !== "text") {
        return false;
      } else {
        return includeSignal(contentPart.text, signal);
      }
    }
  });
}

function isUserMessage(
  message: ChatCompletionMessageParam
): message is ChatCompletionUserMessageParam {
  return message.role === "user";
}

function includeSignal(content: string, signal: string) {
  return content.toLowerCase().includes(signal);
}

type RequiredAll<T> = {
  [K in keyof T]-?: T[K];
};

type ChatCompletionMessageWithToolCalls = RequiredAll<
  Omit<ChatCompletionMessage, "function_call">
>;

export function processMessage(message: ChatCompletionMessage) {
  if (isMessageHasToolCalls(message)) {
    return extractFunctionArguments(message);
  } else {
    return message.content;
  }
}

function isMessageHasToolCalls(
  message: ChatCompletionMessage
): message is ChatCompletionMessageWithToolCalls {
  return (
    isDefined(message.tool_calls) &&
    message.tool_calls.length !== 0 &&
    !isDefined(message.content) // content should be null when tool_calls is present
  );
}

function extractFunctionArguments(message: ChatCompletionMessageWithToolCalls) {
  if (!isDefined(message.tool_calls[0]?.function)) {
    throw new Error("No function found in the tool call");
  }

  try {
    return {
      function_name: message.tool_calls[0].function.name,
      arguments: JSON.parse(message.tool_calls[0].function.arguments),
    };
  } catch (error) {
    throw new Error("Invalid JSON in function arguments");
  }
}
