import fs from "fs";
import { DescribedFunctionName } from "../services/function-descriptions.js";

Object.values(DescribedFunctionName).forEach((value) => {
  // the filePath can be tricky to get right.
  // 'abc.ts' will create a new file in the root directory
  const filePath = `src/services/functions/${value}.ts`;

  if (fs.existsSync(filePath)) {
    console.log(`File ${filePath} already exists!`);
    return;
  }

  fs.open(filePath, "w", (err) => {
    if (err) {
      throw err;
    }
    console.log(`File ${filePath} has been saved!`);
    return;
  });
});
