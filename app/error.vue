<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps<{ error: NuxtError }>();
</script>

<template>
  <Html>
    <Body>
      <div class="border rounded-2xl">
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
              <Button @click="clearError">
                {{ $t("error.goHome") }}
              </Button>
            </EmptyContent>
          </Empty>
        </main>
      </div>
    </Body>
  </Html>
</template>
