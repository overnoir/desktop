export default function () {
  const { general } = storeToRefs(useSettingsStore());

  const size = computed(() => Math.round(general.value.size));
  const radius = computed(() =>
    Math.round((general.value.size * general.value.radius) / 200),
  );

  const boxStyles = computed(() => ({
    borderRadius: `${Math.round(radius.value)}px`,
    height: `${Math.round(size.value)}px`,
    width: `${Math.round(size.value)}px`,
  }));

  const iconStyles = computed(() => ({
    height: `${Math.round(general.value.size / 4.5)}px`,
    width: `${Math.round(general.value.size / 4.5)}px`,
  }));

  const backgroundStyles = computed(() => ({
    borderRadius: `${Math.round(radius.value * 1.15)}px`,
    padding: `${Math.round(general.value.size / 25)}px`,
  }));

  const nameStyles = computed(() => ({
    borderRadius: `${Math.round(radius.value)}px`,
    fontSize: `${Math.round(general.value.size / 5.5)}px`,
    maxWidth: `${Math.round(size.value)}px`,
  }));

  const avatarDecorationStyles = computed(() => ({
    height: `${Math.round(size.value)}px`,
    width: `${Math.round(size.value)}px`,
  }));

  const speakingStyles = computed(() => ({
    "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 ${Math.round(
      general.value.size / 15,
    )}px var(--tw-ring-color)`,
    borderRadius: `${Math.round(radius.value)}px`,
    height: `${Math.round(size.value)}px`,
    width: `${Math.round(size.value)}px`,
  }));

  const gapStyles = computed(() => ({
    gap: `${Math.round((general.value.size * general.value.gap) / 100)}px`,
  }));

  const opacityStyles = computed(() => ({
    opacity: `${Math.round(general.value.opacity)}%`,
  }));

  const borderRadiusStyles = computed(() => ({
    borderRadius: `${Math.round(radius.value)}px`,
  }));

  return {
    avatarDecorationStyles,
    borderRadiusStyles,
    backgroundStyles,
    speakingStyles,
    opacityStyles,
    nameStyles,
    iconStyles,
    gapStyles,
    boxStyles,
  };
}
