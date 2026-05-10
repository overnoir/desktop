import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";
import type { z } from "zod";
import { clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function safeParseWithDefault<T extends z.ZodType>(
  validationSchema: T,
  defaultValue: z.infer<T>,
  value: unknown,
): z.infer<T> {
  let parsedValue: unknown;

  if (typeof value === "string") {
    try {
      parsedValue = JSON.parse(value);
    } catch {
      return defaultValue;
    }
  } else {
    parsedValue = value;
  }

  if (typeof parsedValue !== "object" || parsedValue === null) {
    return defaultValue;
  }

  const result: any = {};
  const shape = (validationSchema as any).shape;

  for (const key in shape) {
    const fieldResult = shape[key].safeParse((parsedValue as any)[key]);

    if (fieldResult.success) {
      result[key] = fieldResult.data;
    } else {
      result[key] = (defaultValue as any)[key];
    }
  }

  return result;
}
