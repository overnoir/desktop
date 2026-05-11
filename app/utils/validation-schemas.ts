import { z } from "zod";

export const settingsSchema = z.object({
  opacity: z.number().min(0).max(100),
  x: z.number().min(-9999).max(9999),
  y: z.number().min(-9999).max(9999),
  radius: z.number().min(0).max(100),
  orientation: z.enum(Orientation),
  size: z.number().min(0).max(100),
  preventCapture: z.boolean(),
  ignoreCursor: z.boolean(),
  background: z.boolean(),
  autoStart: z.boolean(),
  locale: z.enum(Locale),
  settings: z.boolean(),
  theme: z.enum(Theme),
  drag: z.boolean(),
});
