import type { CSSProperties } from "vue";

export default function () {
  const { general } = storeToRefs(useSettingsStore());

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
    if (!general.value.showBackground) {
      return {};
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
    paddingInline: `${Math.round(general.value.size / 18)}px`,
    fontSize: `${Math.round(general.value.size / 5.5)}px`,
    gap: `${Math.round(general.value.size / 18)}px`,
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
      general.value.size / 18,
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

  const liveStyles = computed<CSSProperties>(() => ({
    height: `${Math.round(general.value.size / 9)}px`,
    width: `${Math.round(general.value.size / 9)}px`,
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
    liveStyles,
    boxStyles,
  };
}
