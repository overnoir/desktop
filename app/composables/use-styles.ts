import type { CSSProperties } from "vue";

export default function () {
  const { filtredStreamers } = storeToRefs(useKickStore());
  const { general } = storeToRefs(useSettingsStore());
  const isOnline = useOnline();
  const {
    settings: discordSettings,
    filtredUsers,
    guild,
  } = storeToRefs(useDiscordStore());

  const boxStyles = computed<CSSProperties>(() => ({
    borderRadius: `${Math.round((general.value.size * general.value.radius) / 200)}px`,
    height: `${Math.round(general.value.size)}px`,
    width: `${Math.round(general.value.size)}px`,
  }));

  const iconStyles = computed<CSSProperties>(() => ({
    height: `${Math.round(general.value.size / 5.5)}px`,
    width: `${Math.round(general.value.size / 5.5)}px`,
  }));

  const backgroundStyles = computed<CSSProperties>(() => {
    if (
      !general.value.showBackground ||
      (isOnline.value &&
        !(guild.value && discordSettings.value.showGuild) &&
        filtredStreamers.value.length === 0 &&
        filtredUsers.value.length === 0 &&
        !general.value.showSettings &&
        !general.value.showDrag)
    ) {
      return {
        minHeight: "1px",
        minWidth: "1px",
      };
    }

    return {
      borderRadius: `${Math.round(((general.value.size * general.value.radius) / 200) * 1.15)}px`,
      padding: `${Math.round(general.value.size / 25)}px`,
      backgroundColor: "var(--background)",
      border: "1px solid var(--border)",
    };
  });

  const nameStyles = computed<CSSProperties>(() => ({
    borderRadius: `${Math.round((general.value.size * general.value.radius) / 200)}px`,
    paddingInline: `${Math.round(general.value.size / 22)}px`,
    fontSize: `${Math.round(general.value.size / 5.5)}px`,
    maxWidth: `${Math.round(general.value.size)}px`,
  }));

  const avatarDecorationStyles = computed<CSSProperties>(() => ({
    height: `${Math.round(general.value.size)}px`,
    width: `${Math.round(general.value.size)}px`,
  }));

  const speakingStyles = computed<CSSProperties>(() => ({
    borderRadius: `${Math.round((general.value.size * general.value.radius) / 200)}px`,
    height: `${Math.round(general.value.size)}px`,
    width: `${Math.round(general.value.size)}px`,
    "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 ${Math.round(
      general.value.size / 17,
    )}px var(--tw-ring-color)`,
  }));

  const pageStyles = computed<CSSProperties>(() => ({
    gap: `${Math.round((general.value.size * general.value.gap) / 100)}px`,
    flexDirection:
      general.value.orientation === Orientation.Vertical ? "column" : "row",
  }));

  const htmlStyles = computed<CSSProperties>(() => ({
    opacity: `${Math.round(general.value.opacity)}%`,
  }));

  const iconsStyles = computed<CSSProperties>(() => ({
    borderRadius: `${Math.round((general.value.size * general.value.radius) / 200)}px`,
    padding: `${Math.round(general.value.size / 22)}px`,
    gap: `${Math.round(general.value.size / 22)}px`,
  }));

  return {
    avatarDecorationStyles,
    backgroundStyles,
    speakingStyles,
    iconsStyles,
    htmlStyles,
    nameStyles,
    iconStyles,
    pageStyles,
    boxStyles,
  };
}
