import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { isChatEnding } from "./chat-utils.js";

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
