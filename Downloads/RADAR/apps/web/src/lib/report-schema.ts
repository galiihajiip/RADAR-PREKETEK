import { z } from "zod";

export const reportSchema = z.object({
  reporterName: z.string().min(2),
  address: z.string().min(5),
  description: z.string().min(12),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  consent: z.literal("on")
});
