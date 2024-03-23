import { z } from "zod";

import { SongError, UserError } from "../../helpers/enums";

export const songErrorResponseSchema = z.object({
    success: z.boolean(),
    code: z.nativeEnum(SongError),
    message: z.string()
});

export const userErrorResponseSchema = z.object({
    success: z.boolean(),
    code: z.nativeEnum(UserError),
    message: z.string()
});