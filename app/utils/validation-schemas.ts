import { z } from "zod";

export const settingsSchema = z.object({
  opacity: z.number().min(0).max(100),
  x: z.number().min(-9999).max(9999),
  y: z.number().min(-9999).max(9999),
  radius: z.number().min(0).max(100),
  orientation: z.enum(Orientation),
  size: z.number().min(0).max(250),
  preventCapture: z.boolean(),
  showBackground: z.boolean(),
  ignoreCursor: z.boolean(),
  showSettings: z.boolean(),
  isDraggable: z.boolean(),
  autoStart: z.boolean(),
  locale: z.enum(Locale),
  theme: z.enum(Theme),
}) satisfies z.ZodType<SettingsStore>;

export const discordSchema = z.object({
  isEnabled: z.boolean(),
}) satisfies z.ZodType<DiscordStore>;
