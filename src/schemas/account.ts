import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// Web Schemas

export const activateAccountSchema = z.object({
    code: z.string().uuid()
});

export type activateAccountInput = z.infer<typeof activateAccountSchema>;

// GD Schemas

export const registerGJAccountSchema = z.object({
    userName: z.string(),
    password: z.string(),
    email: z.string().email(),
    secret: z.string()
});

export const loginGJAccountSchema = z.object({
    userName: z.string(),
    gjp2: z.string(),
    secret: z.string()
});

export const updateGJAccSettingsSchema = z.object({
    accountID: z.string(),
    gjp2: z.string(),
    mS: z.string(),
    frS: z.string(),
    cS: z.string(),
    yt: z.string(),
    twitter: z.string(),
    twitch: z.string(),
    secret: z.string()
});

export type registerGJAccountInput = z.infer<typeof registerGJAccountSchema>;
export type loginGJAccountInput = z.infer<typeof loginGJAccountSchema>;
export type updateGJAccSettingsInput = z.infer<typeof updateGJAccSettingsSchema>;

export const { schemas: accountSchemas, $ref: $accountRef } = buildJsonSchemas({
    
}, { $id: "accountSchema" });