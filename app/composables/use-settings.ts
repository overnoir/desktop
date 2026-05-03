import { toast } from "vue-sonner";

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
  const { t } = useNuxtApp().$i18n;

  function reset() {
    settings.value = getDefaultValue();
    toast(t("settings.reset.success"));
  }

  return { settings, getDefaultValue, reset };
}
