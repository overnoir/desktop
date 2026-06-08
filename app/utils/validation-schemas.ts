import { z } from "zod";

export const settingsSchema = z.object({
  opacity: z.number().min(0).max(100),
  x: z.number().min(-9999).max(9999),
  y: z.number().min(-9999).max(9999),
  radius: z.number().min(0).max(100),
  orientation: z.enum(Orientation),
  size: z.number().min(0).max(250),
  gap: z.number().min(0).max(100),
  preventCapture: z.boolean(),
  showBackground: z.boolean(),
  ignoreCursor: z.boolean(),
  showSettings: z.boolean(),
  isDraggable: z.boolean(),
  autoStart: z.boolean(),
  locale: z.enum(Locale),
  theme: z.enum(Theme),
}) satisfies z.ZodType<Settings>;

export const discordSchema = z.object({
  settings: z.object({
    showAvatarDecorationAnimated: z.enum(Show),
    userLimit: z.number().min(0).max(50),
    showAvatarDecoration: z.enum(Show),
    displayName: z.enum(DisplayName),
    showAvatarAnimated: z.enum(Show),
    showOnlySpeakers: z.boolean(),
    showDisplayName: z.enum(Show),
    showMe: z.boolean(),
  }),
  errors: z.array(
    z.object({
      createdAt: z.number(),
      message: z.string(),
      id: z.string(),
    }),
  ),
  userId: z.string().optional(),
  connected: z.boolean(),
}) satisfies z.ZodType<Discord>;
