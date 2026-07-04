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
          name: t("linkGroups.0.links.0.name"),
          to: localePath("/settings/general"),
          links: [
            {
              name: t("linkGroups.0.links.0.links.0"),
              to: localePath("/settings/general"),
            },
            {
              name: t("linkGroups.0.links.0.links.1"),
              to: localePath("/settings/advanced"),
            },
          ],
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
          to: localePath("/discord/connection"),
          name: "Discord",
          links: [
            {
              name: t("linkGroups.1.links.0.links.0"),
              to: localePath("/discord/connection"),
            },
            {
              name: t("linkGroups.1.links.0.links.1"),
              to: localePath("/discord/settings"),
            },
          ],
        },
        {
          icon: "simple-icons:kick",
          to: localePath("/kick/streamers"),
          name: "Kick",
          links: [
            {
              name: t("linkGroups.1.links.1.links.0"),
              to: localePath("/kick/streamers"),
            },
            {
              name: t("linkGroups.1.links.1.links.1"),
              to: localePath("/kick/settings"),
            },
          ],
        },
        {
          name: t("linkGroups.1.links.2.name"),
          to: localePath("/system/connection"),
          icon: "lucide:gauge",
          links: [
            {
              name: t("linkGroups.1.links.2.links.0"),
              to: localePath("/system/connection"),
            },
            {
              name: t("linkGroups.1.links.2.links.1"),
              to: localePath("/system/settings"),
            },
          ],
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
