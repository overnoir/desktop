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
          to: localePath("/errors"),
          icon: "lucide:triangle-alert",
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
          icon: "lucide:gauge",
          to: localePath("/system"),
          name: t("linkGroups.1.links.0"),
        },
      ],
    }));

    const community = computed<LinkGroup>(() => ({
      name: t("linkGroups.2.name"),
      links: [
        {
          name: t("linkGroups.2.links.0"),
          to: localePath("/help"),
          icon: "lucide:info",
        },
      ],
    }));

    return { general, connectors, community };
  },
  {
    tauri: {
      autoStart: false,
      save: false,
      sync: false,
    },
  },
);
