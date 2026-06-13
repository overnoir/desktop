<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps<{ error: NuxtError }>();
</script>

<template>
  <Html class="rounded-xl">
    <Body class="rounded-xl">
      <LayoutTitlebar />
      <main class="h-screen overflow-auto grid place-items-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon name="lucide:triangle-alert" />
            </EmptyMedia>
          </EmptyHeader>
          <EmptyTitle>{{ error }}</EmptyTitle>
          <EmptyContent>
            <Button @click="clearError({ redirect: $localePath('/') })">
              {{ $t("error.goHome") }}
            </Button>
          </EmptyContent>
        </Empty>
      </main>
    </Body>
  </Html>
</template>
