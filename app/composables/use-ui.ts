export default function () {
  const { general } = storeToRefs(useSettingsStore());

  const overlayStyles = computed(() => {
    const { size, radius, opacity, gap } = general.value;

    return {
      backgroundBorderRadius: `${Math.round(((size * radius) / 200) * 1.15)}px`,
      borderRadius: `${Math.round((size * radius) / 200)}px`,
      backgroundPadding: `${Math.round(size / 25)}px`,
      nameFontSize: `${Math.round(size / 5.5)}px`,
      gap: `${Math.round((size * gap) / 100)}px`,
      ringWidth: `${Math.round(size / 15)}px`,
      iconSize: `${Math.round(size / 4.5)}px`,
      opacity: `${Math.round(opacity)}%`,
      size: `${Math.round(size)}px`,
    };
  });

  return { overlayStyles };
}
