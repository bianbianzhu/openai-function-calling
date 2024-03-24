import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs";
import { isDefined } from "./common-utils.js";
import { RequiredAll } from "./type-utils.js";
import { StaticPromptMap } from "../services/prompt-map.js";

/**
 * ChatCompletionMessageParam is for API request
 * ChatCompletionMessage is for API response
 */

/** This is only a subset of the possible signals that can be used to end the chat */
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
export function isChatEnding(
  message: ChatCompletionMessageParam | undefined | null
) {
  if (!isDefined(message)) {
    return console.log(StaticPromptMap.fallback);
  }

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

type ChatCompletionMessageWithToolCalls = RequiredAll<
  Omit<ChatCompletionMessage, "function_call">
>;

/**
 * This function processes the message from the API response.
 * If the message contains tool_calls, it extracts the function arguments.
 * Otherwise, it returns the content of the message.
 * @param message the message from the API response
 * @returns the content of the message (string or null) or the function arguments (object)
 */
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
  return message.tool_calls.map((toolCall) => {
    if (!isDefined(toolCall.function)) {
      throw new Error("No function found in the tool call");
    }

    try {
      return {
        tool_call_id: toolCall.id,
        function_name: toolCall.function.name,
        arguments: JSON.parse(toolCall.function.arguments),
      };
    } catch (error) {
      throw new Error("Invalid JSON in function arguments");
    }
  });
}
