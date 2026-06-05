<script setup lang="ts">
const { user } = defineProps<{
  user: VoiceUser;
}>();

const { discordSettings } = storeToRefs(useDiscordSettingsStore());
const { appSettings } = storeToRefs(useAppSettingsStore());

const displayName = computed(() =>
  discordSettings.value.displayName === VoiceUserDisplayName.Nick
    ? user.nick || user.username
    : discordSettings.value.displayName === VoiceUserDisplayName.Username
      ? user.username
      : undefined,
);

const boxStyle = computed(() => ({
  borderRadius: `${(appSettings.value.size * appSettings.value.radius) / 200}px`,
  height: `${appSettings.value.size}px`,
  width: `${appSettings.value.size}px`,
}));

const displayNameSize = computed(() => `${appSettings.value.size / 5.5}px`);
const displayNameMaxWidth = computed(() => `${appSettings.value.size}px`);
const ringWidth = computed(() => `${appSettings.value.size / 15}px`);
const iconSize = computed(() => `${appSettings.value.size / 4.5}px`);
const radius = computed(
  () => `${(appSettings.value.size * appSettings.value.radius) / 200}px`,
);
</script>

<template>
  <div class="relative">
    <NuxtImg
      :src="`https://cdn.discordapp.com/avatars/${user.userId}/${user.avatar}.webp?size=4096`"
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
      v-if="displayName"
      class="absolute bg-background/70 left-0 bottom-0 inline-block w-fit px-[4%] truncate"
      :style="{
        borderRadius: radius,
        maxWidth: displayNameMaxWidth,
        fontSize: displayNameSize,
      }"
    >
      {{ displayName }}
    </div>
  </div>
</template>
