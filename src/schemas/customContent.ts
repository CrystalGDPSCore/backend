import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// Web Schemas

export const getSfxFileSchema = z.object({
    file: z.string()
});

export const getMp3FileSchema = z.object({
    id: z.number()
});

export type getSfxFileInput = z.infer<typeof getSfxFileSchema>;
export type getMp3FileInput = z.infer<typeof getMp3FileSchema>;

export const { schemas: customContentSchemas, $ref: $customContentRef } = buildJsonSchemas({

}, { $id: "customContentSchema" });