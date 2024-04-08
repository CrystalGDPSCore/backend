import { z } from "zod";

export const getGJUserInfoSchema = z.object({
    targetAccountID: z.coerce.number().int(),
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    secret: z.string()
});

export type GetGJUserInfoInput = z.infer<typeof getGJUserInfoSchema>;

export const getGJUsersSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    str: z.string(),
    secret: z.string()
});

export type GetGJUsersInput = z.infer<typeof getGJUsersSchema>;

export const requestUserAccessSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    secret: z.string()
});

export type RequestUserAccessInput = z.infer<typeof requestUserAccessSchema>;