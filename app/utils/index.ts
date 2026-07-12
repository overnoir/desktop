import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function isObject(value: unknown): boolean {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function generateDiscordUserAvatarUrl({
  id,
  avatar,
  animated,
}: {
  id?: string;
  avatar: string | null;
  animated?: boolean;
}): string {
  return id && avatar
    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=4096&animated=${animated || false}`
    : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(id || 0) >> 22n) % 6n)}.png`;
}

export function generateDiscordUserDisplayName({
  user,
  displayName,
}: {
  user: Pick<DiscordUser, "username" | "discriminator" | "nick" | "globalName">;
  displayName: DiscordDisplayName;
}): string {
  const username =
    user.discriminator === "0"
      ? user.username
      : `${user.username}#${user.discriminator}`;
  if (displayName === DiscordDisplayName.Nick) return user.nick || username;
  if (displayName === DiscordDisplayName.GlobalName)
    return user.globalName || user.nick || username;
  return username;
}
