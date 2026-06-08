<script setup lang="ts">
const { user } = defineProps<{
  user: DiscordUser;
}>();

const { settings } = storeToRefs(useSettingsStore());
const { discord } = storeToRefs(useDiscordStore());

const displayName = computed(() =>
  discord.value.settings.displayName === DisplayName.Nick
    ? user.nick || user.username
    : user.username,
);

const showDisplayName = computed(() => {
  if (discord.value.settings.showDisplayName === ShowDisplayName.WhileSpeaking)
    return user.isSpeaking;
  if (discord.value.settings.showDisplayName === ShowDisplayName.Never)
    return false;
  return true;
});

const boxStyle = computed(() => ({
  borderRadius: `${(settings.value.size * settings.value.radius) / 200}px`,
  height: `${settings.value.size}px`,
  width: `${settings.value.size}px`,
}));

const displayNameSize = computed(() => `${settings.value.size / 5.5}px`);
const displayNameMaxWidth = computed(() => `${settings.value.size}px`);
const ringWidth = computed(() => `${settings.value.size / 15}px`);
const iconSize = computed(() => `${settings.value.size / 4.5}px`);
const radius = computed(
  () => `${(settings.value.size * settings.value.radius) / 200}px`,
);
</script>

<template>
  <div class="relative">
    <NuxtImg
      :src="`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=4096`"
      class="size-full border border-input"
      :style="boxStyle"
      alt="Avatar"
    />
    <div
      v-if="user.isSpeaking"
      :style="{
        '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 ${ringWidth} var(--tw-ring-color)`,
        ...boxStyle,
      }"
      class="absolute left-0 top-0 ring ring-inset ring-green-600"
    />
    <div
      v-if="
        user.isSelfDeafened ||
        user.isSelfMuted ||
        user.isDeafened ||
        user.isMuted
      "
      class="absolute bg-background/70 left-0 top-0 flex items-center gap-[4%] p-[4%]"
      :style="{
        borderRadius: radius,
      }"
      :class="{ '[&>svg]:text-red-600': user.isMuted }"
    >
      <Icon
        v-if="user.isMuted || user.isSelfMuted"
        :style="{ width: iconSize, height: iconSize }"
        name="lucide:mic-off"
      />
      <Icon
        v-if="user.isDeafened || user.isSelfDeafened"
        :style="{ width: iconSize, height: iconSize }"
        name="lucide:headphone-off"
      />
    </div>
    <div
      v-if="displayName && showDisplayName"
      class="absolute bg-background/70 left-0 bottom-0 inline-block w-fit px-[4%] truncate"
      :style="{
        maxWidth: displayNameMaxWidth,
        fontSize: displayNameSize,
        borderRadius: radius,
      }"
    >
      {{ displayName }}
    </div>
  </div>
</template>
