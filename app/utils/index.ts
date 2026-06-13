import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";

export function isObject(value: unknown) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateDiscordUserAvatarUrl({
  id,
  avatar,
  animated,
}: {
  id?: string;
  avatar?: string;
  animated?: boolean;
}) {
  return id && avatar
    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=4096&animated=${animated || false}`
    : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(id || 0) >> 22n) % 6n)}.png`;
}
