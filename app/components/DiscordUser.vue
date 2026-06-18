<script setup lang="ts">
const { user } = defineProps<{
  user: DiscordUser;
}>();

const { settings } = storeToRefs(useDiscordStore());
const {
  avatarDecorationStyles,
  speakingStyles,
  iconsStyles,
  iconStyles,
  nameStyles,
  boxStyles,
} = useUi();

const displayName = computed(() =>
  generateDiscordUserDisplayName({
    user,
    displayName: settings.value.displayName,
  }),
);

const showDisplayName = computed(() => {
  if (settings.value.showDisplayName === Show.WhileSpeaking)
    return user.isSpeaking;
  if (settings.value.showDisplayName === Show.Never) return false;
  return true;
});

const showAvatarAnimated = computed(() => {
  if (settings.value.showAvatarAnimated === Show.WhileSpeaking)
    return user.isSpeaking;
  if (settings.value.showAvatarAnimated === Show.Never) return false;
  return true;
});

const showAvatarDecoration = computed(() => {
  if (!user.avatarDecoration) return false;
  if (settings.value.showAvatarDecoration === Show.WhileSpeaking)
    return user.isSpeaking;
  if (settings.value.showAvatarDecoration === Show.Never) return false;
  return true;
});

const showAvatarDecorationAnimated = computed(() => {
  if (settings.value.showAvatarDecorationAnimated === Show.WhileSpeaking)
    return user.isSpeaking;
  if (settings.value.showAvatarDecorationAnimated === Show.Never) return false;
  return true;
});

const avatarUrl = computed(() =>
  generateDiscordUserAvatarUrl({
    animated: showAvatarAnimated.value,
    avatar: user.avatar,
    id: user.id,
  }),
);
</script>

<template>
  <div class="relative">
    <NuxtImg
      :src="avatarUrl"
      class="size-full border"
      :style="boxStyles"
      alt="Avatar"
    />
    <NuxtImg
      v-if="user.avatarDecoration && showAvatarDecoration"
      :src="`${
        showAvatarDecorationAnimated
          ? `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatarDecoration.asset}.png?size=4096`
          : `https://cdn.discordapp.com/media/v1/collectibles-shop/${user.avatarDecoration.skuId}/static`
      }`"
      class="absolute left-0 top-0 size-full scale-[1.2]"
      alt="Avatar Decoration"
      :style="avatarDecorationStyles"
    />
    <div
      v-if="user.isSpeaking"
      :style="speakingStyles"
      class="absolute left-0 top-0 ring ring-inset ring-green-600"
    />
    <div
      v-if="
        user.isSelfDeafened ||
        user.isSelfMuted ||
        user.isDeafened ||
        user.isMuted ||
        user.isBot
      "
      class="absolute bg-background/70 left-0 top-0 flex items-center"
      :style="iconsStyles"
    >
      <Icon
        v-if="user.isMuted || user.isSelfMuted"
        :style="iconStyles"
        :class="{ 'text-red-600': user.isMuted }"
        name="lucide:mic-off"
      />
      <Icon
        v-if="user.isDeafened || user.isSelfDeafened"
        :style="iconStyles"
        :class="{ 'text-red-600': user.isDeafened }"
        name="lucide:headphone-off"
      />
      <Icon
        v-if="user.isBot"
        :style="iconStyles"
        class="scale-110"
        name="lucide:bot"
      />
    </div>
    <div
      v-if="showDisplayName"
      class="absolute bg-background/70 left-0 bottom-0 inline-block w-fit truncate"
      :style="nameStyles"
    >
      {{ displayName }}
    </div>
  </div>
</template>
