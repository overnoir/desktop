<script setup lang="ts">
import type { CSSProperties } from "vue";

const { user } = defineProps<{
  user: DiscordUser;
}>();

const { settings } = storeToRefs(useDiscordStore());
const { general } = storeToRefs(useSettingsStore());

const avatarDecorationUrl = computed(() =>
  !user.avatarDecoration
    ? undefined
    : showAvatarDecorationAnimated.value
      ? `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatarDecoration.asset}.png?size=4096`
      : `https://cdn.discordapp.com/media/v1/collectibles-shop/${user.avatarDecoration.skuId}/static`,
);

const showDisplayName = computed(
  () =>
    settings.value.showDisplayName !== DiscordShow.Never &&
    (settings.value.showDisplayName !== DiscordShow.WhileSpeaking ||
      user.isSpeaking),
);

const showAvatarAnimated = computed(
  () =>
    settings.value.showAvatarAnimated !== DiscordShow.Never &&
    (settings.value.showAvatarAnimated !== DiscordShow.WhileSpeaking ||
      user.isSpeaking),
);

const showAvatarDecoration = computed(
  () =>
    !!user.avatarDecoration &&
    settings.value.showAvatarDecoration !== DiscordShow.Never &&
    (settings.value.showAvatarDecoration !== DiscordShow.WhileSpeaking ||
      user.isSpeaking),
);

const showAvatarDecorationAnimated = computed(
  () =>
    settings.value.showAvatarDecorationAnimated !== DiscordShow.Never &&
    (settings.value.showAvatarDecorationAnimated !==
      DiscordShow.WhileSpeaking ||
      user.isSpeaking),
);

const statusIcons = computed(() => {
  const icons: OverlayItemIcon[] = [];

  if (user.isDeafened || user.isSelfDeafened) {
    icons.push({ name: "lucide:headphone-off", variant: "destructive" });
  }
  if (user.isMuted || user.isSelfMuted) {
    icons.push({ name: "lucide:mic-off", variant: "destructive" });
  }
  if (user.isBot) {
    icons.push({ name: "lucide:bot" });
  }

  return icons;
});

const speakingStyles = computed<CSSProperties>(() => ({
  borderRadius: `${Math.round((general.value.size * general.value.radius) / 200)}px`,
  "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 ${Math.round(
    general.value.size / 17,
  )}px var(--tw-ring-color)`,
  height: `${general.value.size}px`,
  width: `${general.value.size}px`,
}));

const avatarDecorationStyles = computed<CSSProperties>(() => ({
  height: `${general.value.size}px`,
  width: `${general.value.size}px`,
}));

const displayName = computed(() =>
  generateDiscordUserDisplayName({
    user,
    displayName: settings.value.displayName,
  }),
);

const avatarUrl = computed(() =>
  generateDiscordUserAvatarUrl({
    animated: showAvatarAnimated.value,
    avatar: user.avatar,
    id: user.id,
  }),
);
</script>

<template>
  <OverlayItem>
    <OverlayItemContent>
      <NuxtImg :src="avatarUrl" class="size-full" alt="Avatar" />
    </OverlayItemContent>
    <OverlayItemIcons v-if="statusIcons.length" :icons="statusIcons" />
    <OverlayItemLabel v-if="showDisplayName" position="bottom">
      {{ displayName }}
    </OverlayItemLabel>
    <NuxtImg
      v-if="avatarDecorationUrl && showAvatarDecoration"
      class="absolute left-0 top-0 size-full scale-[1.2]"
      :style="avatarDecorationStyles"
      :src="avatarDecorationUrl"
      alt="Avatar Decoration"
    />
    <div
      v-if="user.isSpeaking"
      class="absolute left-0 top-0 ring ring-inset ring-green-600"
      :style="speakingStyles"
    />
  </OverlayItem>
</template>
