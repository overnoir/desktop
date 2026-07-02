export const useLinkGroupsStore = defineStore(
  "link-groups",
  () => {
    const localePath = useLocalePath();
    const { t } = useI18n();

    const general = computed<LinkGroup>(() => ({
      name: t("linkGroups.0.name"),
      links: [
        {
          icon: "lucide:sliders-horizontal",
          name: t("linkGroups.0.links.0"),
          to: localePath("/settings"),
        },
        {
          name: t("linkGroups.0.links.1"),
          to: localePath("/vault"),
          icon: "lucide:vault",
        },
        {
          name: t("linkGroups.0.links.2"),
          icon: "lucide:triangle-alert",
          to: localePath("/errors"),
        },
        {
          icon: "lucide:circle-question-mark",
          name: t("linkGroups.0.links.3"),
          to: localePath("/help"),
        },
      ],
    }));

    const connectors = computed<LinkGroup>(() => ({
      name: t("linkGroups.1.name"),
      links: [
        {
          icon: "simple-icons:discord",
          to: localePath("/discord"),
          name: "Discord",
        },
        {
          icon: "simple-icons:kick",
          to: localePath("/kick"),
          name: "Kick",
        },
        {
          name: t("linkGroups.1.links.0"),
          to: localePath("/system"),
          icon: "lucide:gauge",
        },
      ],
    }));

    return { general, connectors };
  },
  {
    tauri: {
      autoStart: false,
      save: false,
      sync: false,
    },
  },
);
