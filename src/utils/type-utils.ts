export type RequiredAll<T> = {
  [K in keyof T]-?: T[K];
};

export type JsonAcceptable =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "null";

export type ConvertTypeNameStringLiteralToType<T> = T extends "number"
  ? number
  : T extends "string"
  ? string
  : T extends "boolean"
  ? boolean
  : T extends "object"
  ? object
  : T extends "array"
  ? unknown[]
  : T extends "null"
  ? null
  : never;

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.length > 0;
};
