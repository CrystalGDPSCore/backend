import { z } from "zod";

export const uploadGJLevelSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    levelID: z.coerce.number().int(),
    levelName: z.string(),
    levelDesc: z.string(),
    levelVersion: z.coerce.number().int(),
    levelLength: z.enum(["0", "1", "2", "3", "4", "5"]).transform(value => {
        switch (value) {
            case "0":
                return "Tiny";
            case "1":
                return "Short";
            case "2":
                return "Medium";
            case "3":
                return "Long";
            case "4":
                return "XL";
            case "5":
                return "Platformer";
        }
    }),
    audioTrack: z.coerce.number().int(),
    original: z.coerce.number().int(),
    twoPlayer: z.enum(["0", "1"]).transform(value => value == "1"),
    songID: z.coerce.number().int(),
    objects: z.coerce.number().int(),
    coins: z.coerce.number().int(),
    requestedStars: z.coerce.number().int(),
    unlisted: z.enum(["0", "1", "2"]).transform(value => {
        switch (value) {
            case "0":
                return "Listed";
            case "1":
                return "FriendsOnly";
            case "2":
                return "Unlisted";
        }
    }),
    ldm: z.enum(["0", "1"]).transform(value => value == "1"),
    songIDs: z.string().transform(value => value.split(",").map(songId => parseInt(songId))).catch([]),
    sfxIDs: z.string().transform(value => value.split(",").map(sfxId => parseInt(sfxId))).catch([]),
    levelString: z.string(),
    secret: z.string()
});

export type UploadGJLevelInput = z.infer<typeof uploadGJLevelSchema>;