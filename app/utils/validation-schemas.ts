import { z } from "zod";

export const settingsUISchema = z.preprocess(
  (value) => {
    if (!isObject(value)) {
      return defaultSettingsUI;
    }
    return value;
  },
  z.object({
    opacity: z.number().min(0).max(100).catch(defaultSettingsUI.opacity),
    radius: z.number().min(0).max(100).catch(defaultSettingsUI.radius),
    size: z.number().min(0).max(250).catch(defaultSettingsUI.size),
    gap: z.number().min(0).max(100).catch(defaultSettingsUI.gap),
  }),
) satisfies z.ZodType<SettingsUI>;

export const settingsAdvancedSchema = z.preprocess(
  (value) => {
    if (!isObject(value)) {
      return defaultSettingsAdvanced;
    }
    return value;
  },
  z.object({
    orientation: z.enum(Orientation).catch(defaultSettingsAdvanced.orientation),
    preventCapture: z.boolean().catch(defaultSettingsAdvanced.preventCapture),
    showBackground: z.boolean().catch(defaultSettingsAdvanced.showBackground),
    showSettings: z.boolean().catch(defaultSettingsAdvanced.showSettings),
    ignoreCursor: z.boolean().catch(defaultSettingsAdvanced.ignoreCursor),
    alignment: z.enum(Alignment).catch(defaultSettingsAdvanced.alignment),
    isDraggable: z.boolean().catch(defaultSettingsAdvanced.isDraggable),
    x: z.number().min(-9999).max(9999).catch(defaultSettingsAdvanced.x),
    y: z.number().min(-9999).max(9999).catch(defaultSettingsAdvanced.y),
    autoStart: z.boolean().catch(defaultSettingsAdvanced.autoStart),
    locale: z.enum(Locale).catch(defaultSettingsAdvanced.locale),
  }),
) satisfies z.ZodType<SettingsAdvanced>;

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
