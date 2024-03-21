export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.length > 0;
};
