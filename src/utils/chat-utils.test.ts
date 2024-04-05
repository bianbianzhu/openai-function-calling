import OpenAI from "openai";
import { isChatEnding } from "./chat-utils.js";
import { processMessage } from "./chat-utils.js";

type ChatCompletionMessage = OpenAI.ChatCompletionMessage;
type ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

describe("isChatEnding", () => {
  it("should return true if user message contains chat end signal", () => {
    const message: ChatCompletionMessageParam = {
      role: "user",
      content: "I think that is all I need. Goodbye!",
    };
    expect(isChatEnding(message)).toBe(true);
  });

  it("should return false if user message does not contain chat end signal", () => {
    const message: ChatCompletionMessageParam = {
      role: "user",
      content: "Hello, I need help with something.",
    };
    expect(isChatEnding(message)).toBe(false);
  });

  it("should return false if message is not a user message", () => {
    const message: ChatCompletionMessageParam = {
      role: "assistant",
      content: "QUIT",
    };
    expect(isChatEnding(message)).toBe(false);
  });

  it("should return true if the 1st chatCompletion content part of the user message has end signal", () => {
    const message: ChatCompletionMessageParam = {
      role: "user",
      content: [
        {
          type: "text",
          text: "End chat. No more questions.",
        },
        {
          type: "image_url",
          image_url: {
            url: "https://example.com/image.jpg",
          },
        },
      ],
    };
    expect(isChatEnding(message)).toBe(true);
  });

  it("should return false if the 1st chatCompletion content part of the user message contains an image", () => {
    const message: ChatCompletionMessageParam = {
      content: [
        {
          type: "image_url",
          image_url: {
            url: "https://example.com/image.jpg",
          },
        },
        {
          type: "text",
          text: "End chat. No more questions.",
        },
      ],
      role: "user",
    };

    const result = isChatEnding(message);

    expect(result).toBe(false);
  });
});

describe("processMessage", () => {
  it("should return extracted function arguments if message has tool calls", () => {
    const message: ChatCompletionMessage = {
      role: "assistant",
      content: null,
      tool_calls: [
        {
          id: "call_VNFyxIaiRNrGKD8YvpCOZ0Cy",
          type: "function",
          function: {
            name: "test_function",
            arguments: '{"arg1":"one", "arg2":"two", "arg3":"three"}',
          },
        },
      ],
    };
    const expected = [
      {
        function_name: "test_function",
        arguments: {
          arg1: "one",
          arg2: "two",
          arg3: "three",
        },
        tool_call_id: "call_VNFyxIaiRNrGKD8YvpCOZ0Cy",
      },
    ];
    expect(processMessage(message)).toEqual(expected);
  });

  it("should return message content if message does not have tool calls", () => {
    const message: ChatCompletionMessage = {
      role: "assistant",
      content: "Hello, I need help with something.",
    };
    expect(processMessage(message)).toEqual(message.content);
  });
});
