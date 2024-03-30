import {
  ConvertedFunctionParamProps,
  FileComplaintProps,
} from "../function-descriptions.js";

export async function file_complaint(
  args: ConvertedFunctionParamProps<FileComplaintProps>
): Promise<string> {
  const { email, text, name } = args;
  return JSON.stringify({
    email,
    text,
    name,
    solution: "we will get back to you in 24 hours.",
    coupon: "10% off your next visit",
  });
}
