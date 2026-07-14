export default function () {
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
        icon: "lucide:scroll-text",
        to: localePath("/logs"),
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
        to: localePath("/system"),
        icon: "lucide:gauge",
      },
    ],
  }));

  const social = computed<LinkGroup>(() => ({
    links: [
      {
        name: "Website",
        to: "https://overnoir.com",
        icon: "lucide:globe",
      },
      {
        name: t("linkGroups.2.links.0"),
        to: "https://docs.overnoir.com",
        icon: "lucide:book",
      },
      {
        name: "Discord",
        to: "https://discord.gg/xxx",
        icon: "simple-icons:discord",
      },
      {
        name: "GitHub",
        to: "https://github.com/overnoir/desktop",
        icon: "simple-icons:github",
      },
      {
        name: "X",
        to: "https://x.com/overnoirapp",
        icon: "simple-icons:x",
      },
    ],
  }));

  const legal = computed<LinkGroup>(() => ({
    links: [
      {
        name: t("linkGroups.3.links.0"),
        to: "https://overnoir.com/terms-of-service",
      },
      {
        name: t("linkGroups.3.links.1"),
        to: "https://overnoir.com/privacy-policy",
      },
    ],
  }));

  return { general, connectors, social, legal };
}
