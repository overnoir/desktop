import { z } from "zod";

export const settingsGeneralSchema = z.preprocess(
  (value) => {
    if (!isObject(value)) {
      return defaultSettingsGeneral;
    }
    return value;
  },
  z.object({
    orientation: z.enum(Orientation).catch(defaultSettingsGeneral.orientation),
    showBackground: z.boolean().catch(defaultSettingsGeneral.showBackground),
    opacity: z.number().min(0).max(100).catch(defaultSettingsGeneral.opacity),
    radius: z.number().min(0).max(100).catch(defaultSettingsGeneral.radius),
    showSettings: z.boolean().catch(defaultSettingsGeneral.showSettings),
    alignment: z.enum(Alignment).catch(defaultSettingsGeneral.alignment),
    size: z.number().min(0).max(250).catch(defaultSettingsGeneral.size),
    x: z.number().min(-9999).max(9999).catch(defaultSettingsGeneral.x),
    y: z.number().min(-9999).max(9999).catch(defaultSettingsGeneral.y),
    gap: z.number().min(0).max(100).catch(defaultSettingsGeneral.gap),
    showDrag: z.boolean().catch(defaultSettingsGeneral.showDrag),
    locale: z.enum(Locale).catch(defaultSettingsGeneral.locale),
  }),
) satisfies z.ZodType<SettingsGeneral>;

export const settingsAdvancedSchema = z.preprocess(
  (value) => {
    if (!isObject(value)) {
      return defaultSettingsAdvanced;
    }
    return value;
  },
  z.object({
    preventCapture: z.boolean().catch(defaultSettingsAdvanced.preventCapture),
    ignoreCursor: z.boolean().catch(defaultSettingsAdvanced.ignoreCursor),
    alwaysOnTop: z.boolean().catch(defaultSettingsAdvanced.alwaysOnTop),
    autoStart: z.boolean().catch(defaultSettingsAdvanced.autoStart),
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
    showMutedUsers: z.boolean().catch(defaultDiscordSettings.showMutedUsers),
    showGuild: z.boolean().catch(defaultDiscordSettings.showGuild),
    showBots: z.boolean().catch(defaultDiscordSettings.showBots),
    showMe: z.boolean().catch(defaultDiscordSettings.showMe),
    showAvatarDecorationAnimated: z
      .enum(Show)
      .catch(defaultDiscordSettings.showAvatarDecorationAnimated),
    showGuildIconAnimated: z
      .boolean()
      .catch(defaultDiscordSettings.showGuildIconAnimated),
    showAvatarDecoration: z
      .enum(Show)
      .catch(defaultDiscordSettings.showAvatarDecoration),
    showAvatarAnimated: z
      .enum(Show)
      .catch(defaultDiscordSettings.showAvatarAnimated),
    showDeafenedUsers: z
      .boolean()
      .catch(defaultDiscordSettings.showDeafenedUsers),
    showSpeakersOnly: z
      .boolean()
      .catch(defaultDiscordSettings.showSpeakersOnly),
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
    avatar: z.string().optional(),
    username: z.string(),
    id: z.string(),
  })
  .optional()
  .nullable()
  .catch(null)
  .transform(
    (value) => value ?? null,
  ) satisfies z.ZodType<DiscordConnectedUser | null>;
