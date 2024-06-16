import { z } from "zod";

export const likeGJItemSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    itemID: z.coerce.number().int(),
    like: z.enum(["0", "1"]).transform(value => {
        switch (value) {
            case "0":
                return "Dislike";
            case "1":
                return "Like";
        }
    }),
    type: z.enum(["1", "2", "3", "4"]).transform(value => {
        switch (value) {
            case "1":
                return "Level";
            case "2":
                return "Comment";
            case "3":
                return "UserComment";
            case "4":
                return "LevelList";
        }
    }),
    secret: z.string()
});

export type LikeGJItemInput = z.infer<typeof likeGJItemSchema>;