<script setup lang="ts">
const { user } = defineProps<{
  user: DiscordUser;
}>();

const { settings: discordSettings } = storeToRefs(useDiscordStore());
const { overlayStyles } = useUi();

const displayName = computed(() =>
  discordSettings.value.displayName === DisplayName.Nick
    ? user.nick || user.username
    : user.username,
);

const showDisplayName = computed(() => {
  if (discordSettings.value.showDisplayName === Show.WhileSpeaking)
    return user.isSpeaking;
  if (discordSettings.value.showDisplayName === Show.Never) return false;
  return true;
});

const showAvatarAnimated = computed(() => {
  if (discordSettings.value.showAvatarAnimated === Show.WhileSpeaking)
    return user.isSpeaking;
  if (discordSettings.value.showAvatarAnimated === Show.Never) return false;
  return true;
});

const showAvatarDecoration = computed(() => {
  if (!user.avatarDecoration) return false;
  if (discordSettings.value.showAvatarDecoration === Show.WhileSpeaking)
    return user.isSpeaking;
  if (discordSettings.value.showAvatarDecoration === Show.Never) return false;
  return true;
});

const showAvatarDecorationAnimated = computed(() => {
  if (discordSettings.value.showAvatarDecorationAnimated === Show.WhileSpeaking)
    return user.isSpeaking;
  if (discordSettings.value.showAvatarDecorationAnimated === Show.Never)
    return false;
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
      :style="{
        borderRadius: overlayStyles.borderRadius,
        height: overlayStyles.size,
        width: overlayStyles.size,
      }"
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
      :style="{
        height: overlayStyles.size,
        width: overlayStyles.size,
      }"
    />
    <div
      v-if="user.isSpeaking"
      :style="{
        '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 ${overlayStyles.ringWidth} var(--tw-ring-color)`,
        borderRadius: overlayStyles.borderRadius,
        height: overlayStyles.size,
        width: overlayStyles.size,
      }"
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
      class="absolute bg-background/70 left-0 top-0 flex items-center gap-[4%] p-[4%]"
      :style="{
        borderRadius: overlayStyles.borderRadius,
      }"
    >
      <Icon
        v-if="user.isMuted || user.isSelfMuted"
        :style="{
          width: overlayStyles.iconSize,
          height: overlayStyles.iconSize,
        }"
        :class="{ 'text-red-600': user.isMuted }"
        name="lucide:mic-off"
      />
      <Icon
        v-if="user.isDeafened || user.isSelfDeafened"
        :style="{
          width: overlayStyles.iconSize,
          height: overlayStyles.iconSize,
        }"
        :class="{ 'text-red-600': user.isDeafened }"
        name="lucide:headphone-off"
      />
      <Icon
        v-if="user.isBot"
        :style="{
          width: overlayStyles.iconSize,
          height: overlayStyles.iconSize,
        }"
        class="scale-110"
        name="lucide:bot"
      />
    </div>
    <div
      v-if="showDisplayName"
      class="absolute bg-background/70 left-0 bottom-0 inline-block w-fit px-[4%] truncate"
      :style="{
        borderRadius: overlayStyles.borderRadius,
        fontSize: overlayStyles.nameFontSize,
        maxWidth: overlayStyles.size,
      }"
    >
      {{ displayName }}
    </div>
  </div>
</template>
