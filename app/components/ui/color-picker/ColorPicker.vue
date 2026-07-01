<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import {
  ColorSliderTrack,
  ColorSliderThumb,
  ColorFieldInput,
  ColorSliderRoot,
  ColorAreaThumb,
  normalizeColor,
  ColorFieldRoot,
  ColorAreaRoot,
  ColorAreaArea,
  colorToString,
  ColorSwatch,
  type Color,
} from "reka-ui";

const props = defineProps<{
  modelValue?: string;
  defaultValue?: string;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue || "#000000",
});

const colorObj = ref<Color>(normalizeColor(modelValue.value || "#000000"));
const hexColor = computed(() => colorToString(colorObj.value, "hex"));

watch(
  modelValue,
  (val) => {
    if (val) colorObj.value = normalizeColor(val);
  },
  { immediate: true },
);

function handleColorUpdate(newColor: Color) {
  colorObj.value = newColor;
  modelValue.value = colorToString(newColor, "hex");
}

function handleHexUpdate(hex: string) {
  colorObj.value = normalizeColor(hex);
  modelValue.value = hex;
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        class="px-2 hover:bg-background"
        :class="props.class"
      >
        <ColorSwatch
          :color="hexColor"
          class="size-5 rounded-sm border"
          :style="{ backgroundColor: 'var(--reka-color-swatch-color)' }"
        />
        <span>{{ hexColor }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <div class="flex flex-col gap-2">
        <ColorAreaRoot
          v-slot="{ style }"
          :model-value="colorObj"
          color-space="hsl"
          x-channel="saturation"
          y-channel="lightness"
          @update:color="handleColorUpdate"
        >
          <ColorAreaArea
            class="relative w-full h-35 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
            :style="style"
          >
            <ColorAreaThumb
              class="block w-4 h-4 rounded-full bg-background border cursor-pointer hover:scale-110 transition-transform"
            />
          </ColorAreaArea>
        </ColorAreaRoot>
        <div class="flex flex-col gap-2">
          <ColorSliderRoot
            :model-value="colorObj"
            channel="hue"
            color-space="hsl"
            class="relative flex items-center w-full h-4"
            @update:color="handleColorUpdate"
          >
            <ColorSliderTrack class="relative flex-1 rounded-full h-2">
              <div class="absolute inset-0 rounded-full hue-gradient" />
            </ColorSliderTrack>
            <ColorSliderThumb
              class="block w-4 h-4 rounded-full bg-background border cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </ColorSliderRoot>
        </div>
        <div class="flex flex-col gap-2">
          <ColorSliderRoot
            :model-value="colorObj"
            channel="alpha"
            color-space="hsl"
            class="relative flex items-center w-full h-4"
            @update:color="handleColorUpdate"
          >
            <ColorSliderTrack
              class="relative flex-1 rounded-full h-2 checkerboard-bg"
            >
              <div class="absolute inset-0 rounded-full" />
            </ColorSliderTrack>
            <ColorSliderThumb
              class="block w-4 h-4 rounded-full bg-background border cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </ColorSliderRoot>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <ColorSwatch
            :color="hexColor"
            class="rounded-sm border"
            :style="{ backgroundColor: 'var(--reka-color-swatch-color)' }"
          />
          <ColorFieldRoot
            :model-value="hexColor"
            class="flex-2"
            @update:model-value="handleHexUpdate"
          >
            <ColorFieldInput
              class="w-full px-2 py-1.5 text-sm border bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-mono"
              placeholder="#000000"
            />
          </ColorFieldRoot>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
