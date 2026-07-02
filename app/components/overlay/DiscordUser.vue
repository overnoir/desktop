<script setup lang="ts">
import type { CSSProperties } from "vue";

const { user } = defineProps<{
  user: DiscordUser;
}>();

const { settings } = storeToRefs(useDiscordStore());
const { general } = storeToRefs(useSettingsStore());

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

const statusIcons = computed(() => {
  const icons: OverlayItemIcon[] = [];

  if (user.isMuted || user.isSelfMuted) {
    icons.push({
      variant: user.isMuted ? "destructive" : "default",
      name: "lucide:mic-off",
    });
  }
  if (user.isDeafened || user.isSelfDeafened) {
    icons.push({
      variant: user.isDeafened ? "destructive" : "default",
      name: "lucide:headphone-off",
    });
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
    <div
      v-if="user.isSpeaking"
      class="absolute left-0 top-0 ring ring-inset ring-green-600"
      :style="speakingStyles"
    />
  </OverlayItem>
</template>
