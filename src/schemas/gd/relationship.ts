import { z } from "zod";

export const getGJUserListSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    type: z.enum(["0", "1"]).transform(value => {
        switch (value) {
            case "0":
                return "friendList";
            case "1":
                return "blockList";
        }
    }),
    secret: z.string()
});

export type GetGJUserListInput = z.infer<typeof getGJUserListSchema>;

export const removeGJFriendSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    targetAccountID: z.coerce.number().int(),
    secret: z.string()
});

export type RemoveGJFriendInput = z.infer<typeof removeGJFriendSchema>;