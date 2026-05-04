export default function () {
  function getDefaultValue(): Settings {
    return {
      orientation: "horizontal",
      theme: "system",
      opacity: 100,
      drag: true,
      x: 0,
      y: 0,
    };
  }

  const settings = useLocalStorage<Settings>("settings", getDefaultValue());

  function reset() {
    settings.value = getDefaultValue();
  }

  return { settings, getDefaultValue, reset };
}
