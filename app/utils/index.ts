import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";

export function isObject(value: unknown) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
