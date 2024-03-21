import {
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs";

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

function isUserMessage(
  message: ChatCompletionMessageParam
): message is ChatCompletionUserMessageParam {
  return message.role === "user";
}

function includeSignal(content: string, signal: string) {
  return content.toLowerCase().includes(signal);
}

export function isChatEnding(message: ChatCompletionMessageParam) {
  if (!isUserMessage(message)) {
    return false;
  }
  // user message must have content
  const { content } = message;
  return CHAT_END_SIGNALS.some((signal) => {
    if (typeof content === "string") {
      return includeSignal(content, signal);
    } else {
      // ChatCompletionContentPart can be either ChatCompletionContentPartText or ChatCompletionContentPartImage
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
