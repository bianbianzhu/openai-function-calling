import readline from "readline";
import { UserPromptMap } from "./prompt-map.js";

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
  return UserPromptMap.task(userInput);
}
