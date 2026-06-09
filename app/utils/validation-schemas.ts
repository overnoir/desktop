import { z } from "zod";

export const settingsSchema = z.preprocess(
  (value) => {
    if (!isObject(value)) {
      return defaultSettings;
    }
    return value;
  },
  z.object({
    orientation: z.enum(Orientation).catch(defaultSettings.orientation),
    opacity: z.number().min(0).max(100).catch(defaultSettings.opacity),
    preventCapture: z.boolean().catch(defaultSettings.preventCapture),
    radius: z.number().min(0).max(100).catch(defaultSettings.radius),
    showBackground: z.boolean().catch(defaultSettings.showBackground),
    showSettings: z.boolean().catch(defaultSettings.showSettings),
    ignoreCursor: z.boolean().catch(defaultSettings.ignoreCursor),
    size: z.number().min(0).max(250).catch(defaultSettings.size),
    isDraggable: z.boolean().catch(defaultSettings.isDraggable),
    x: z.number().min(-9999).max(9999).catch(defaultSettings.x),
    y: z.number().min(-9999).max(9999).catch(defaultSettings.y),
    gap: z.number().min(0).max(100).catch(defaultSettings.gap),
    autoStart: z.boolean().catch(defaultSettings.autoStart),
    locale: z.enum(Locale).catch(defaultSettings.locale),
    theme: z.enum(Theme).catch(defaultSettings.theme),
  }),
) satisfies z.ZodType<Settings>;

export const discordSettingsSchema = z.preprocess(
  (value) => {
    if (!isObject(value)) {
      return defaultDiscordSettings;
    }
    return value;
  },
  z.object({
    showDisplayName: z.enum(Show).catch(defaultDiscordSettings.showDisplayName),
    displayName: z.enum(DisplayName).catch(defaultDiscordSettings.displayName),
    showMe: z.boolean().catch(defaultDiscordSettings.showMe),
    showAvatarDecorationAnimated: z
      .enum(Show)
      .catch(defaultDiscordSettings.showAvatarDecorationAnimated),
    showAvatarDecoration: z
      .enum(Show)
      .catch(defaultDiscordSettings.showAvatarDecoration),
    showAvatarAnimated: z
      .enum(Show)
      .catch(defaultDiscordSettings.showAvatarAnimated),
    showOnlySpeakers: z
      .boolean()
      .catch(defaultDiscordSettings.showOnlySpeakers),
    userLimit: z
      .number()
      .min(0)
      .max(50)
      .catch(defaultDiscordSettings.userLimit),
  }),
) satisfies z.ZodType<DiscordSettings>;

const discordErrorSchema = z.object({
  createdAt: z.number(),
  message: z.string(),
  id: z.string(),
});

export const discordErrorsSchema = z.preprocess(
  (value) => {
    return Array.isArray(value) ? value : [];
  },
  z
    .array(discordErrorSchema)
    .transform((errors) =>
      errors.filter((error) => discordErrorSchema.safeParse(error).success),
    ),
) satisfies z.ZodType<DiscordError[]>;

export const discordConnectedUserSchema = z
  .object({
    id: z.string(),
  })
  .optional()
  .nullable()
  .catch(null)
  .transform(
    (value) => value ?? null,
  ) satisfies z.ZodType<DiscordConnectedUser | null>;
