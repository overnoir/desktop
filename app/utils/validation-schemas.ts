import { z } from "zod";

export const settingsSchema = z.object({
  opacity: z.number().min(0).max(100),
  orientation: z.enum(Orientation),
  size: z.number().min(0).max(100),
  preventCapture: z.boolean(),
  autoStart: z.boolean(),
  locale: z.enum(Locale),
  theme: z.enum(Theme),
  drag: z.boolean(),
  x: z.number(),
  y: z.number(),
});
