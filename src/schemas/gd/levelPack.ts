import { z } from "zod";

export const getGJGauntletsSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    secret: z.string()
});

export type GetGJGauntletsInput = z.infer<typeof getGJGauntletsSchema>;

export const getGJMapPacksSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    page: z.coerce.number().int(),
    secret: z.string()
});

export type GetGJMapPacksInput = z.infer<typeof getGJMapPacksSchema>;