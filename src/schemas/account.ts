import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// Web Schemas

export const activateAccountSchema = z.object({
    code: z.string().uuid()
});

export const registerSuccessSchema = z.object({
    message: z.string()
});

export const apiRegisterAccountSchema = z.object({
    name: z.string().min(3).max(15),
    password: z.string().min(6).max(20),
    email: z.string().email().min(5).max(32)
});

export type activateAccountInput = z.infer<typeof activateAccountSchema>;
export type apiRegisterAccountInput = z.infer<typeof apiRegisterAccountSchema>;

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

export const backupGJAccountNewSchema = z.object({
    accountID: z.string(),
    gjp2: z.string(),
    saveData: z.string(),
    secret: z.string()
});

export const syncGJAccountNewSchema = z.object({
    accountID: z.string(),
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
export type backupGJAccountNewInput = z.infer<typeof backupGJAccountNewSchema>;
export type syncGJAccountNewInput = z.infer<typeof syncGJAccountNewSchema>;
export type updateGJAccSettingsInput = z.infer<typeof updateGJAccSettingsSchema>;

export const { schemas: accountSchemas, $ref: $accountRef } = buildJsonSchemas({
    apiRegisterAccountSchema,
    registerSuccessSchema
}, { $id: "accountSchema" });