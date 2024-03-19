import { z } from "zod";

export const registerGJAccountSchema = z.object({
    userName: z.string(),
    password: z.string(),
    email: z.string(),
    secret: z.string()
});

export type RegisterGJAccountInput = z.infer<typeof registerGJAccountSchema>;

export const loginGJAccountSchema = z.object({
    userName: z.string(),
    gjp2: z.string(),
    secret: z.string()
});

export type LoginGJAccountInput = z.infer<typeof loginGJAccountSchema>;

export const updateGJAccSettingsSchema = z.object({
    accountID: z.coerce.number(),
    gjp2: z.string(),
    mS: z.coerce.number(),
    frS: z.coerce.number(),
    cS: z.coerce.number(),
    yt: z.string(),
    twitter: z.string(),
    twitch: z.string(),
    secret: z.string()
});

export type UpdateGJAccSettingsInput = z.infer<typeof updateGJAccSettingsSchema>;

export const backupGJAccountNewSchema = z.object({
    accountID: z.coerce.number(),
    gjp2: z.string(),
    saveData: z.string(),
    gameVersion: z.coerce.number().int(),
    binaryVersion: z.coerce.number().int(),
    secret: z.string()
});

export type BackupGJAccountNewInput = z.infer<typeof backupGJAccountNewSchema>;

export const syncGJAccountNewSchema = z.object({
    accountID: z.coerce.number(),
    gjp2: z.string(),
    secret: z.string()
});

export type SyncGJAccountNewInput = z.infer<typeof syncGJAccountNewSchema>;