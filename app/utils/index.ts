import type {
  Monitor,
  PhysicalPosition,
  PhysicalSize,
} from "@tauri-apps/api/window";
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

export function generateOverlaySidePosition({
  overlay: { position, size },
  size: { width, height },
  orientation,
  monitor,
}: {
  size: Pick<PhysicalSize, "width" | "height">;
  overlay: {
    position: PhysicalPosition;
    size: PhysicalSize;
  };
  orientation: Orientation;
  monitor: Monitor | null;
}): { x: number; y: number } {
  const offset = 10;
  let x = 0;
  let y = 0;

  if (orientation === Orientation.Vertical) {
    if (monitor) {
      const monitorRight = monitor.position.x + monitor.size.width;
      const rightX = position.x + size.width + offset;
      const leftX = position.x - width - offset;
      const monitorLeft = monitor.position.x;

      if (rightX + width <= monitorRight) {
        x = rightX;
      } else if (leftX >= monitorLeft) {
        x = leftX;
      } else {
        x = rightX;
      }
    } else {
      x = position.x + size.width + offset;
    }

    y = position.y;
  }

  if (orientation === Orientation.Horizontal) {
    if (monitor) {
      const monitorBottom = monitor.position.y + monitor.size.height;
      const bottomY = position.y + size.height + offset;
      const topY = position.y - height - offset;
      const monitorTop = monitor.position.y;

      if (bottomY + height <= monitorBottom) {
        y = bottomY;
      } else if (topY >= monitorTop) {
        y = topY;
      } else {
        y = bottomY;
      }
    } else {
      y = position.y + size.height + offset;
    }

    x = position.x;
  }

  if (monitor) {
    x = Math.max(
      monitor.position.x + offset,
      Math.min(x, monitor.position.x + monitor.size.width - width - offset),
    );
    y = Math.max(
      monitor.position.y + offset,
      Math.min(y, monitor.position.y + monitor.size.height - height - offset),
    );
  }

  return { x, y };
}
