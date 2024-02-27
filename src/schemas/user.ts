import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// Web Schemas

export const registerUserSchema = z.object({
    userName: z.string(),
    passHash: z.string(),
    email: z.string().email()
});

export type registerUserInput = z.infer<typeof registerUserSchema>;

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