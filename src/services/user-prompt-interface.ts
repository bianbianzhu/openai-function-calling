import readline from "readline";

export const userPromptInterface = async (hint: string) => {
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
