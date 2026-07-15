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
    opacity: z.number().min(0).max(100).catch(defaultSettingsGeneral.opacity),
    showBackground: z.boolean().catch(defaultSettingsGeneral.showBackground),
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
    alwaysOnTop: z.boolean().catch(defaultSettingsAdvanced.alwaysOnTop),
    autoStart: z.boolean().catch(defaultSettingsAdvanced.autoStart),
    ignoreCursorEvents: z
      .boolean()
      .catch(defaultSettingsAdvanced.ignoreCursorEvents),
    contentProtected: z
      .boolean()
      .catch(defaultSettingsAdvanced.contentProtected),
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
    showDisplayName: z
      .enum(DiscordShow)
      .catch(defaultDiscordSettings.showDisplayName),
    displayName: z
      .enum(DiscordDisplayName)
      .catch(defaultDiscordSettings.displayName),
    showMutedUsers: z.boolean().catch(defaultDiscordSettings.showMutedUsers),
    showGuild: z.boolean().catch(defaultDiscordSettings.showGuild),
    showBots: z.boolean().catch(defaultDiscordSettings.showBots),
    showMe: z.boolean().catch(defaultDiscordSettings.showMe),
    showGuildIconAnimated: z
      .boolean()
      .catch(defaultDiscordSettings.showGuildIconAnimated),
    showAvatarAnimated: z
      .enum(DiscordShow)
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
      .max(MAX_DISCORD_USER_LIMIT)
      .catch(defaultDiscordSettings.userLimit),
  }),
) satisfies z.ZodType<DiscordSettings>;

export const discordConnectedUserSchema = z
  .object({
    avatar: z
      .string()
      .nullish()
      .transform((v) => v ?? null),
    username: z.string(),
    id: z.string(),
  })
  .optional()
  .nullable()
  .catch(null)
  .transform(
    (value) => value ?? null,
  ) satisfies z.ZodType<DiscordConnectedUser | null>;

export const kickAddChannelSchema = toTypedSchema(
  z.object({
    slug: z
      .string({
        error: "kick.addChannel.empty",
      })
      .regex(/^(?!\d+$)(?!_)(?!.*_$)(?!.*__)[a-z0-9_]{3,25}$/, {
        error: "kick.addChannel.invalid",
      }),
  }),
);

export const kickSettingsSchema = z.preprocess(
  (value) => {
    if (!isObject(value)) {
      return defaultKickSettings;
    }
    return value;
  },
  z.object({
    displayName: z.enum(KickDisplayName).catch(defaultKickSettings.displayName),
    showCategory: z
      .enum([KickShow.WhileLive, KickShow.Never])
      .catch(defaultKickSettings.showCategory),
    showOnlyLive: z.boolean().catch(defaultKickSettings.showOnlyLive),
    showDisplayName: z
      .enum(KickShow)
      .catch(defaultKickSettings.showDisplayName),
    streamerLimit: z
      .number()
      .min(0)
      .max(MAX_KICK_STREAMER_COUNT)
      .catch(defaultKickSettings.streamerLimit),
  }),
) satisfies z.ZodType<KickSettings>;

const kickStreamerStreamSchema = z.object({
  category: z.string(),
  isLive: z.boolean(),
}) satisfies z.ZodType<KickStreamerStream>;

const kickStreamerSchema = z.object({
  stream: kickStreamerStreamSchema,
  profilePicture: z.string(),
  name: z.string(),
  slug: z.string(),
  id: z.number(),
}) satisfies z.ZodType<KickStreamer>;

export const kickStreamersSchema = z.preprocess(
  (value) => {
    return Array.isArray(value) ? value : [];
  },
  z
    .array(kickStreamerSchema)
    .max(MAX_KICK_STREAMER_COUNT)
    .transform((streamers) =>
      streamers.filter(
        (streamer) => kickStreamerSchema.safeParse(streamer).success,
      ),
    ),
) satisfies z.ZodType<KickStreamer[]>;

export const systemSettingsSchema = z.preprocess(
  (value) => {
    if (!isObject(value)) {
      return defaultSystemSettings;
    }
    return value;
  },
  z.object({
    showBattery: z.boolean().catch(defaultSystemSettings.showBattery),
    showNetwork: z.boolean().catch(defaultSystemSettings.showNetwork),
    showMemory: z.boolean().catch(defaultSystemSettings.showMemory),
    showCpu: z.boolean().catch(defaultSystemSettings.showCpu),
  }),
) satisfies z.ZodType<SystemSettings>;

export const isConnectedSchema = z.boolean().catch(false);
