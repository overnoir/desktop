const VOICE_EVENTS = [
  DiscordRPCEventName.VoiceStateCreate,
  DiscordRPCEventName.VoiceStateUpdate,
  DiscordRPCEventName.VoiceStateDelete,
  DiscordRPCEventName.SpeakingStart,
  DiscordRPCEventName.SpeakingStop,
];

export default function () {
  const guild = ref<DiscordGuild | undefined>(undefined);
  const { connectedUser, isConnected, settings } =
    storeToRefs(useDiscordStore());
  const { logError } = useLogs();

  const filteredUsers = computed(() => {
    if (!guild.value || !connectedUser.value) {
      return [];
    }

    let users = guild.value.channel.users;

    if (!settings.value.showMe) {
      users = users.filter(({ id }) => id !== connectedUser.value!.id);
    }

    if (settings.value.showSpeakersOnly) {
      users = users.filter(({ isSpeaking }) => isSpeaking);
    }

    if (!settings.value.showMutedUsers) {
      users = users.filter(
        ({ isMuted, isSelfMuted, isSuppress }) =>
          !isMuted && !isSelfMuted && !isSuppress,
      );
    }

    if (!settings.value.showDeafenedUsers) {
      users = users.filter(
        ({ isDeafened, isSelfDeafened }) => !isDeafened && !isSelfDeafened,
      );
    }

    if (!settings.value.showBots) {
      users = users.filter(({ isBot }) => !isBot);
    }

    users.sort((a, b) => {
      if (a.isSpeaking !== b.isSpeaking) {
        return a.isSpeaking ? -1 : 1;
      }

      const aMuted = a.isMuted || a.isSelfMuted;
      const bMuted = b.isMuted || b.isSelfMuted;

      if (aMuted !== bMuted) {
        return aMuted ? 1 : -1;
      }

      if (a.isBot !== b.isBot) {
        return a.isBot ? 1 : -1;
      }

      const aName = generateDiscordUserDisplayName({
        user: a,
        displayName: settings.value.displayName,
      }).toLowerCase();

      const bName = generateDiscordUserDisplayName({
        user: b,
        displayName: settings.value.displayName,
      }).toLowerCase();

      return aName.localeCompare(bName);
    });

    if (settings.value.userLimit > 0) {
      users = users.slice(0, settings.value.userLimit);
    }

    return users;
  });

  async function connect() {
    const connectedUser =
      await tauriCoreInvoke<DiscordConnectedUser>("connect_discord");

    await Promise.all([
      subscribe([{ event: DiscordRPCEventName.VoiceChannelSelect }]),
      getSelectedVoiceChannel(),
    ]);

    return connectedUser;
  }

  async function disconnect({
    deleteVaultItems,
  }: {
    deleteVaultItems: boolean;
  }) {
    await unsubscribe([{ event: DiscordRPCEventName.VoiceChannelSelect }]);
    await leaveChannel();
    await tauriCoreInvoke("disconnect_discord", { deleteVaultItems });
  }

  async function listenEvents() {
    await tauriEventListen<DiscordRPCEvent>(
      "discord-event",
      async ({ payload }) => {
        try {
          const { cmd, data, evt } = payload;

          switch (cmd) {
            case DiscordRPCEventCommand.GetSelectedVoiceChannel:
              await handleGetSelectedVoiceChannel(data);
              break;
            case DiscordRPCEventCommand.GetChannel:
              handleGetChannel(data);
              break;
            case DiscordRPCEventCommand.GetGuild:
              handleGetGuild(data);
              break;
            case DiscordRPCEventCommand.Dispatch: {
              if (evt === DiscordRPCEventName.VoiceChannelSelect) {
                await handleVoiceChannelSelect(data);
              } else if (
                evt === DiscordRPCEventName.VoiceStateDelete &&
                (data as { user?: { id?: string } }).user?.id ===
                  connectedUser.value?.id &&
                guild.value?.channel.id
              ) {
                await handleMoved();
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

    await tauriEventListen("discord-disconnected", () => {
      connectedUser.value = null;
      isConnected.value = false;
      guild.value = undefined;
    });
  }

  async function leaveChannel() {
    if (guild.value?.channel.id) {
      await unsubscribeChannel(guild.value.channel.id);
    }

    guild.value = undefined;
  }

  async function handleGetSelectedVoiceChannel(
    data: DiscordRPCSelectedVoiceChannel,
  ) {
    if (!data?.id) {
      return;
    }

    const guildId = (data.guild_id as string) || undefined;
    const users = (data.voice_states ?? []).map(parseUser);

    guild.value = buildGuild(data.id, guildId ?? null);
    guild.value.channel.users = users;

    const promises = [subscribeChannel(data.id), getChannel(data.id)];
    if (guildId) {
      promises.push(getGuild(guildId));
    }
    await Promise.all(promises);
  }

  function handleGetChannel(data: DiscordRPCChannel) {
    if (!guild.value || !data?.id) {
      return;
    }

    if (data.voice_states) {
      guild.value.channel.users = data.voice_states.map(parseUser);
    }

    if (data.name) {
      guild.value.channel.name = data.name;
    }
  }

  function handleGetGuild(data: DiscordRPCGuild) {
    if (!guild.value || !data?.id) {
      return;
    }

    if (data.icon_url) {
      guild.value.iconUrl = data.icon_url;
    }

    if (data.name) {
      guild.value.name = data.name;
    }
  }

  async function handleVoiceChannelSelect(data: DiscordRPCVoiceChannelSelect) {
    await leaveChannel();

    if (!data.channel_id) {
      return;
    }

    guild.value = buildGuild(data.channel_id, data.guild_id ?? null);

    const promises = [
      subscribeChannel(data.channel_id),
      getChannel(data.channel_id),
    ];
    if (data.guild_id) {
      promises.push(getGuild(data.guild_id));
    }
    await Promise.all(promises);
  }

  async function handleMoved() {
    await leaveChannel();
    await getSelectedVoiceChannel();
  }

  function applyVoiceEvent(evt: string, data: DiscordRPCVoiceEvent) {
    if (!guild.value?.channel.id) {
      return;
    }

    const users = guild.value.channel.users;

    switch (evt) {
      case DiscordRPCEventName.VoiceStateCreate:
      case DiscordRPCEventName.VoiceStateUpdate: {
        const user = parseUser(data as DiscordRPCVoiceStateData);
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx !== -1) {
          user.isSpeaking = users[idx]?.isSpeaking || false;
          users.splice(idx, 1, user);
        } else {
          users.push(user);
        }
        break;
      }
      case DiscordRPCEventName.VoiceStateDelete: {
        const userId = data.user?.id;
        guild.value.channel.users = users.filter((u) => u.id !== userId);
        break;
      }
      case DiscordRPCEventName.SpeakingStart: {
        const idx = users.findIndex((u) => u.id === data.user_id);
        if (idx !== -1) {
          users.splice(idx, 1, {
            ...users[idx],
            isSpeaking: true,
          } as DiscordUser);
        }
        break;
      }
      case DiscordRPCEventName.SpeakingStop: {
        const idx = users.findIndex((u) => u.id === data.user_id);
        if (idx !== -1) {
          users.splice(idx, 1, {
            ...users[idx],
            isSpeaking: false,
          } as DiscordUser);
        }
        break;
      }
    }

    guild.value.channel.users = [...guild.value.channel.users];
  }

  async function subscribeChannel(channelId: string) {
    await subscribe(
      VOICE_EVENTS.map((event) => ({
        args: { channel_id: channelId },
        event,
      })),
    );
  }

  async function unsubscribeChannel(channelId: string) {
    await unsubscribe(
      VOICE_EVENTS.map((event) => ({
        args: { channel_id: channelId },
        event,
      })),
    );
  }

  function subscribe(events: DiscordRPCSubscribe[]) {
    return tauriCoreInvoke("discord_subscribe", { events });
  }

  function unsubscribe(events: DiscordRPCSubscribe[]) {
    return tauriCoreInvoke("discord_unsubscribe", { events });
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

  function parseUser(data: DiscordRPCVoiceStateData): DiscordUser {
    const { voice_state, nick, user } = data;

    return {
      isSelfDeafened: voice_state.self_deaf,
      isSelfMuted: voice_state.self_mute,
      discriminator: user.discriminator,
      isSuppress: voice_state.suppress,
      globalName: user.global_name,
      isDeafened: voice_state.deaf,
      isMuted: voice_state.mute,
      username: user.username,
      avatar: user.avatar,
      isSpeaking: false,
      isBot: user.bot,
      id: user.id,
      nick,
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

  return { connect, disconnect, listenEvents, guild, filteredUsers };
}
