import { z } from "zod";

import { SongError } from "../../helpers/enums";

export const songErrorResponseSchema = z.object({
    success: z.boolean(),
    code: z.nativeEnum(SongError),
    message: z.string()
});