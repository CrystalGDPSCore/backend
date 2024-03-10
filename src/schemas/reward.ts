import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// GD Schemas

export const getGJChallengesSchema = z.object({
    accountID: z.string(),
    gjp2: z.string(),
    udid: z.string(),
    chk: z.string(),
    secret: z.string()
});

export type getGJChallengesInput = z.infer<typeof getGJChallengesSchema>;

export const { schemas: customContentSchemas, $ref: $customContentRef } = buildJsonSchemas({

}, { $id: "rewardSchema" });