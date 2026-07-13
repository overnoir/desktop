import { DiscordEventCommand, DiscordEventEvent } from "~/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const VOICE_EVENTS = [
  DiscordEventEvent.VoiceStateCreate,
  DiscordEventEvent.VoiceStateUpdate,
  DiscordEventEvent.VoiceStateDelete,
  DiscordEventEvent.SpeakingStart,
  DiscordEventEvent.SpeakingStop,
];

export default function () {
  const { connectedUser, guild } = storeToRefs(useDiscordStore());

  async function connect() {
    const connectedUser =
      await tauriCoreInvoke<DiscordConnectedUser>("connect_discord");

    await subscribe({ event: DiscordEventEvent.VoiceChannelSelect });
    await getSelectedVoiceChannel();

    return connectedUser;
  }

  async function disconnect({
    deleteVaultItems,
  }: {
    deleteVaultItems: boolean;
  }) {
    await leaveChannel();
    await tauriCoreInvoke("disconnect_discord", { deleteVaultItems });
  }

  async function listen() {
    const { logError } = useLogs();

    await tauriEventListen<DiscordEvent>(
      "discord-event",
      async ({ payload }) => {
        try {
          const { cmd, data, evt } = payload;

          switch (cmd) {
            case DiscordEventCommand.GetSelectedVoiceChannel:
              await handleGetSelectedVoiceChannel(data);
              break;
            case DiscordEventCommand.GetChannel:
              handleGetChannel(data);
              break;
            case DiscordEventCommand.GetGuild:
              handleGetGuild(data);
              break;
            case DiscordEventCommand.Dispatch: {
              if (evt === DiscordEventEvent.VoiceChannelSelect) {
                await handleVoiceChannelSelect(data);
              } else if (
                evt === DiscordEventEvent.VoiceStateDelete &&
                (data as any).user?.id === connectedUser.value?.id &&
                guild.value?.channel.id
              ) {
                await handleForceMoved();
              } else if (evt && VOICE_EVENTS.includes(evt)) {
                applyVoiceEvent(evt, data);
              }
              break;
            }
          }
        } catch (error) {
          await logError({ error, source: LogSource.Discord });
        }
      },
    );
  }

  async function enterChannel(channelId: string, guildId?: string) {
    guild.value = buildGuild(channelId, guildId ?? null);

    await subscribeChannel(channelId);
    await getChannel(channelId);

    if (guildId) {
      await getGuild(guildId);
    }
  }

  async function leaveChannel() {
    if (guild.value?.channel.id) {
      await unsubscribeChannel(guild.value.channel.id);
    }

    guild.value = undefined;
  }

  async function handleGetSelectedVoiceChannel(data: any) {
    if (!data.id) {
      return;
    }

    const guildId = (data.guild_id as string) || undefined;
    const users = (data.voice_states ?? []).map(parseUser);

    guild.value = buildGuild(data.id, guildId ?? null);
    guild.value.channel.users = users;

    await subscribeChannel(data.id);
    await getChannel(data.id);

    if (guildId) {
      await getGuild(guildId);
    }
  }

  function handleGetChannel(data: any) {
    if (!guild.value || !data.id) {
      return;
    }

    if (data.voice_states) {
      guild.value.channel.users = data.voice_states.map(parseUser);
    }

    syncGuild({
      channel: {
        ...guild.value.channel,
        name: (data.name as string) ?? guild.value.channel.name,
      },
    });
  }

  function handleGetGuild(data: any) {
    if (!guild.value || !data.id) {
      return;
    }

    syncGuild({
      iconUrl: data.icon_url ?? guild.value.iconUrl,
      name: data.name ?? guild.value.name,
    });
  }

  async function handleVoiceChannelSelect(data: any) {
    await leaveChannel();

    if (!data.channel_id) {
      return;
    }

    await enterChannel(data.channel_id, data.guild_id || undefined);
  }

  async function handleForceMoved() {
    await leaveChannel();
    await getSelectedVoiceChannel();
  }

  function applyVoiceEvent(evt: string, data: any) {
    if (!guild.value?.channel.id) {
      return;
    }

    const users = guild.value.channel.users;

    switch (evt) {
      case DiscordEventEvent.VoiceStateCreate:
      case DiscordEventEvent.VoiceStateUpdate: {
        const user = parseUser(data);
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx !== -1) {
          user.isSpeaking = users[idx]?.isSpeaking || false;
          users.splice(idx, 1, user);
        } else {
          users.push(user);
        }
        break;
      }
      case DiscordEventEvent.VoiceStateDelete: {
        const userId = (data as any).user?.id as string | undefined;
        guild.value.channel.users = users.filter((u) => u.id !== userId);
        break;
      }
      case DiscordEventEvent.SpeakingStart: {
        const idx = users.findIndex(
          (u) => u.id === (data as { user_id?: string }).user_id,
        );
        if (idx !== -1) {
          users.splice(idx, 1, {
            ...users[idx],
            isSpeaking: true,
          } as DiscordUser);
        }
        break;
      }
      case DiscordEventEvent.SpeakingStop: {
        const idx = users.findIndex(
          (u) => u.id === (data as { user_id?: string }).user_id,
        );
        if (idx !== -1) {
          users.splice(idx, 1, {
            ...users[idx],
            isSpeaking: false,
          } as DiscordUser);
        }
        break;
      }
    }

    syncGuild({ channel: { ...guild.value.channel } });
  }

  function syncGuild(patch: Partial<DiscordGuild>) {
    if (!guild.value) {
      return;
    }

    guild.value = {
      ...guild.value,
      ...patch,
      channel: {
        ...guild.value.channel,
        ...patch.channel,
        users: [...(patch.channel?.users ?? guild.value.channel.users)],
      },
    };
  }

  async function subscribeChannel(channelId: string) {
    for (const evt of VOICE_EVENTS) {
      await subscribe({ event: evt, args: { channel_id: channelId } });
    }
  }

  async function unsubscribeChannel(channelId: string) {
    for (const evt of VOICE_EVENTS) {
      await unsubscribe({ event: evt, args: { channel_id: channelId } });
    }
  }

  async function subscribe({ event, args }: { event: string; args?: object }) {
    await tauriCoreInvoke("discord_subscribe", { event, args });
  }

  async function unsubscribe({
    event,
    args,
  }: {
    event: string;
    args?: object;
  }) {
    await tauriCoreInvoke("discord_unsubscribe", { event, args });
  }

  function getSelectedVoiceChannel() {
    return tauriCoreInvoke("discord_get_selected_voice_channel");
  }

  function getChannel(channelId: string) {
    return tauriCoreInvoke("discord_get_channel", { channelId });
  }

  function getGuild(guildId: string) {
    return tauriCoreInvoke("discord_get_guild", { guildId });
  }

  function parseUser(data: any): DiscordUser {
    const voiceState = data.voice_state;
    const user = data.user;

    return {
      isSelfDeafened: voiceState.self_deaf ?? false,
      isSelfMuted: voiceState.self_mute ?? false,
      isSuppress: voiceState.suppress ?? false,
      discriminator: user.discriminator ?? "",
      globalName: user.global_name ?? null,
      isDeafened: voiceState.deaf ?? false,
      isMuted: voiceState.mute ?? false,
      avatar: user.avatar ?? null,
      isBot: user.bot ?? false,
      username: user.username,
      nick: data.nick ?? null,
      isSpeaking: false,
      id: user.id,
    };
  }

  function buildGuild(channelId: string, guildId: string | null): DiscordGuild {
    return {
      id: guildId || "",
      iconUrl: null,
      name: "",
      channel: {
        id: channelId,
        users: [],
        name: "",
      },
    };
  }

  return { connect, disconnect, listen };
}
