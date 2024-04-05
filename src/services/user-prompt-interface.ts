import readline from "readline";
import { UserPrompts } from "./prompts.js";

const userPromptInterface = async (hint: string) => {
  const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) => {
    userInterface.question(hint, (prompt) => {
      resolve(prompt);
      userInterface.close();
    });
  });
};

export async function createUserMessage() {
  const userInput = await userPromptInterface("You: ");
  return UserPrompts.task(userInput);
}
