import { ItemType, LikeType } from "@prisma/client";

import { z } from "zod";

const createLikeSchema = z.object({
    userId: z.number().int(),
    itemId: z.number().int(),
    itemType: z.nativeEnum(ItemType),
    likeType: z.nativeEnum(LikeType)
});

export type CreateLikeInput = z.infer<typeof createLikeSchema>;