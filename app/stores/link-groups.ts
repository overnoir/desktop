export const useLinkGroupsStore = defineStore(
  "link-groups",
  () => {
    const localePath = useLocalePath();
    const route = useRoute();
    const { t } = useI18n();

    const general = computed<LinkGroup>(() => ({
      name: t("linkGroups.0.name"),
      links: [
        {
          name: t("linkGroups.0.links.0"),
          icon: "lucide:home",
          to: localePath("/"),
        },
        {
          icon: "lucide:sliders-horizontal",
          name: t("linkGroups.0.links.1"),
          to: localePath("/settings"),
        },
        {
          name: t("linkGroups.0.links.2"),
          to: localePath("/vault"),
          icon: "lucide:vault",
        },
        {
          name: t("linkGroups.0.links.3"),
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
      ],
    }));

    const help = computed<LinkGroup>(() => ({
      links: [
        {
          name: t("linkGroups.2.links.0"),
          to: localePath("/help"),
          icon: "lucide:info",
        },
      ],
    }));

    const activeLink = computed(() => {
      return [
        ...connectors.value.links,
        ...general.value.links,
        ...help.value.links,
      ].find(({ to }) => to === route.path)!;
    });

    return { general, connectors, help, activeLink };
  },
  {
    tauri: {
      autoStart: false,
      save: false,
      sync: false,
    },
  },
);
