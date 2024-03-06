import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// Web Schemas

export const registerUserSchema = z.object({
    userName: z.string(),
    passHash: z.string(),
    email: z.string().email()
});

export const updateUserAccessSchema = z.object({
    modRequested: z.boolean(),
    commentColor: z.string()
});

export const updateUserSettingsSchema = z.object({
    messageState: z.enum(["All", "Friends", "None"]), 
    friendState: z.enum(["All", "None"]), 
    commentHistoryState: z.enum(["All", "Friends", "None"]),
    youtube: z.string(),
    twitter: z.string(),
    twitch: z.string()
});

export type registerUserInput = z.infer<typeof registerUserSchema>;
export type updateUserAccessInput = z.infer<typeof updateUserAccessSchema>;
export type updateUserSettingsInput = z.infer<typeof updateUserSettingsSchema>;

// GD Schemas

export const getGJUserInfoSchema = z.object({
    targetAccountID: z.string(),
    accountID: z.string(),
    gjp2: z.string(),
    secret: z.string()
});

export const getGJUsersSchema = z.object({
    accountID: z.string(),
    gjp2: z.string(),
    str: z.string(),
    secret: z.string()
});

export const requestUserAccessSchema = z.object({
    accountID: z.string(),
    gjp2: z.string(),
    secret: z.string()
});

export type getGJUserInfoInput = z.infer<typeof getGJUserInfoSchema>;
export type getGJUsersInput = z.infer<typeof getGJUsersSchema>;
export type requestUserAccessInput = z.infer<typeof requestUserAccessSchema>;

export const { schemas: userSchemas, $ref: $userRef } = buildJsonSchemas({
    
}, { $id: "userSchema" });