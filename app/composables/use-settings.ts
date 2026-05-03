export default function () {
  const defaultValues: Settings = {
    orientation: "horizontal",
    theme: "system",
    opacity: 100,
    drag: false,
    x: 0,
    y: 0,
  };

  const settings = useLocalStorage<Settings>("settings", defaultValues);

  return { settings, defaultValues };
}
